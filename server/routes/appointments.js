import express from 'express';
import Appointment from '../models/Appointment.js';
import Reward from '../models/Reward.js';
import User from '../models/User.js';
import { authenticate, optionalAuthenticate, requireEmployee } from '../middleware/auth.js';
import { validate, appointmentValidation } from '../middleware/validation.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Helper function to parse date and time into DateTime
const parseDateTime = (date, timeSlot) => {
  // Parse timeSlot (e.g., "10:00 AM") and combine with date
  const [time, period] = timeSlot.split(' ');
  const [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours);
  
  if (period === 'PM' && hour24 !== 12) hour24 += 12;
  if (period === 'AM' && hour24 === 12) hour24 = 0;
  
  const dateTime = new Date(date);
  dateTime.setHours(hour24, parseInt(minutes), 0, 0);
  
  return dateTime;
};

// Create appointment (guest, client, or employee can create)
router.post('/', optionalAuthenticate, validate(appointmentValidation), async (req, res) => {
  try {
    const {
      braiderId,
      braiderName,
      date,
      timeSlot,
      customerName,
      customerEmail,
      customerPhone,
      serviceName,
      servicePrice,
      serviceSize,
      serviceLength,
      serviceBoho,
      notes
    } = req.body;

    // Check if time slot is already booked
    const existingAppointment = await Appointment.findOne({
      date,
      timeSlot,
      braiderId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked.' });
    }

    // Find employee user by braiderId (optional - braider may not have registered yet)
    const employee = await User.findOne({ 
      role: 'employee', 
      braiderId: braiderId.toString() 
    });
    
    // Set employeeId if employee exists, otherwise null
    // Appointments can still be created even if braider hasn't registered yet
    const employeeId = employee ? employee._id : null;

    // Determine clientId (optional for guest bookings)
    let clientId = null;
    
    if (req.user) {
      // User is logged in
      if (req.user.role === 'client') {
        clientId = req.user._id;
      } else if (req.user.role === 'employee') {
        // If employee is creating for someone else, use their ID as clientId
        // Or leave as null if it's a guest booking made by employee
        clientId = null; // Employee creating guest booking
      }
    }
    // If req.user is null, it's a guest booking (clientId stays null)

    const dateTime = parseDateTime(date, timeSlot);

    const appointment = new Appointment({
      clientId,
      employeeId,
      braiderId,
      braiderName,
      date,
      timeSlot,
      dateTime,
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone,
      serviceName: serviceName || 'Hair Braiding',
      servicePrice: servicePrice || 0,
      serviceSize: serviceSize || null,
      serviceLength: serviceLength || null,
      serviceBoho: serviceBoho || null,
      notes: notes || '',
      status: 'confirmed'
    });

    await appointment.save();

    // Populate user references for response (if they exist)
    if (appointment.clientId) {
      await appointment.populate('clientId', 'name email');
    }
    if (appointment.employeeId) {
      await appointment.populate('employeeId', 'name email');
    }

    logger.info(`Appointment created: ${appointment._id} for ${appointment.customerName}`);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    logger.error('Create appointment error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate appointment detected.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to create appointment.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get appointments (filtered by user role)
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};

    // Clients see only their appointments
    if (req.user.role === 'client') {
      query.clientId = req.user._id;
    }
    
    // Employees see appointments assigned to them
    if (req.user.role === 'employee') {
      // Match by employeeId OR braiderId (to handle both cases)
      // This ensures braiders see appointments even if employeeId wasn't set correctly
      const conditions = [];
      
      // Match by employeeId (if appointment was linked to employee user)
      if (req.user._id) {
        conditions.push({ employeeId: req.user._id });
      }
      
      // Match by braiderId (primary method - matches the braiderId from booking)
      // Convert to string for comparison to handle both string and number IDs
      if (req.user.braiderId) {
        const userBraiderId = req.user.braiderId.toString();
        conditions.push({ braiderId: userBraiderId });
        // Also try matching as number in case braiderId is stored as number
        const braiderIdNum = parseInt(userBraiderId);
        if (!isNaN(braiderIdNum)) {
          conditions.push({ braiderId: braiderIdNum });
        }
      }
      
      // If no braiderId set, try to match by name (fallback)
      if (conditions.length === 0) {
        // This shouldn't happen if braiderId is set, but provides fallback
        conditions.push({ braiderName: req.user.name });
      }
      
      query.$or = conditions;
    }
    
    // Admins see all appointments (including guest bookings where clientId is null)
    // (no query filter for admins)

    const { status, date, braiderId } = req.query;
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      query.date = date;
    }
    
    if (braiderId && req.user.role !== 'client') {
      query.braiderId = braiderId;
    }

    const appointments = await Appointment.find(query)
      .populate('clientId', 'name email phone')
      .populate('employeeId', 'name email braiderId')
      .sort({ dateTime: -1 });

    // Log for debugging
    if (process.env.NODE_ENV === 'development' && req.user.role === 'employee') {
      logger.debug('Employee appointments query:', {
        userId: req.user._id,
        braiderId: req.user.braiderId,
        query: query,
        count: appointments.length
      });
    }

    res.json({ appointments });
  } catch (error) {
    logger.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

// Get single appointment
router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('clientId', 'name email phone')
      .populate('employeeId', 'name email');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Check access: client can only see their own, employees can see assigned ones
    if (req.user.role === 'client') {
      // Handle guest bookings (clientId is null)
      if (!appointment.clientId || appointment.clientId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied.' });
      }
    }

    if (req.user.role === 'employee') {
      // Handle cases where employeeId or clientId might be null
      const isEmployeeAssigned = appointment.employeeId && 
        appointment.employeeId._id.toString() === req.user._id.toString();
      const isBraiderMatch = appointment.braiderId === req.user.braiderId;
      
      if (!isEmployeeAssigned && !isBraiderMatch) {
        return res.status(403).json({ error: 'Access denied.' });
      }
    }

    res.json({ appointment });
  } catch (error) {
    logger.error('Get appointment error:', error);
    res.status(500).json({ error: 'Failed to fetch appointment.' });
  }
});

// Update appointment status (employee/admin only)
router.patch('/:id/status', authenticate, requireEmployee, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Check if employee has access to this appointment
    if (req.user.role === 'employee') {
      const isEmployeeAssigned = appointment.employeeId && 
        appointment.employeeId.toString() === req.user._id.toString();
      const isBraiderMatch = appointment.braiderId === req.user.braiderId;
      
      if (!isEmployeeAssigned && !isBraiderMatch) {
        return res.status(403).json({ error: 'Access denied.' });
      }
    }

    const oldStatus = appointment.status;
    appointment.status = status;

    // If marking as completed, award points (only if clientId exists)
    if (status === 'completed' && oldStatus !== 'completed' && appointment.clientId) {
      // Award points based on service price (e.g., 1 point per dollar)
      const pointsToAward = Math.floor(appointment.servicePrice || 0);
      
      if (pointsToAward > 0) {
        try {
          let reward = await Reward.findOne({ clientId: appointment.clientId });
          if (!reward) {
            reward = new Reward({ clientId: appointment.clientId });
          }
          await reward.addPoints(pointsToAward, `Appointment completed: ${appointment.serviceName}`);
        } catch (rewardError) {
          // Log but don't fail the status update if rewards fail
          logger.error('Failed to award points:', rewardError);
        }
      }
    }

    // Track cancellation
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      appointment.cancelledAt = new Date();
      appointment.cancelledBy = req.user.role;
    }

    await appointment.save();

    logger.info(`Appointment ${req.params.id} status updated to ${status} by ${req.user.role}`);

    res.json({
      message: 'Appointment status updated',
      appointment
    });
  } catch (error) {
    logger.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment.' });
  }
});

// Cancel appointment (client or employee)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Check access
    const isClientOwner = appointment.clientId && 
      appointment.clientId.toString() === req.user._id.toString();
    const isEmployeeAssigned = req.user.role === 'employee' && 
      ((appointment.employeeId && appointment.employeeId.toString() === req.user._id.toString()) || 
       appointment.braiderId === req.user.braiderId);
    const isAdmin = req.user.role === 'admin';

    if (!isClientOwner && !isEmployeeAssigned && !isAdmin) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Update status instead of deleting (for records)
    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    appointment.cancelledBy = req.user.role === 'client' ? 'client' : 'employee';
    
    await appointment.save();

    logger.info(`Appointment ${req.params.id} cancelled by ${req.user.role}`);

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    logger.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
});

export default router;

