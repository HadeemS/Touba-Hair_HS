import express from 'express';
import Appointment from '../models/Appointment.js';
import Reward from '../models/Reward.js';
import { authenticate, requireEmployee } from '../middleware/auth.js';
import { validate, appointmentValidation } from '../middleware/validation.js';

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

// Create appointment (client or employee can create)
router.post('/', authenticate, validate(appointmentValidation), async (req, res) => {
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
      notes
    } = req.body;

    // Find employee by braiderId (assuming braiderId maps to employee)
    // For now, we'll use the braiderId directly
    // In production, you'd want to map braiderId to actual employee User ID
    
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

    // Determine clientId and employeeId
    let clientId = req.user._id;
    let employeeId = req.user._id; // Default to current user
    
    // If current user is a client, we need to find the employee
    // For now, we'll use a placeholder - in production, map braiderId to employee User
    if (req.user.role === 'client') {
      // Find employee by braiderId (you'll need to set braiderId on User model)
      // For now, we'll create appointment with braiderId reference
      employeeId = req.user._id; // This will need to be updated when you link braiders to users
    }

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
      notes: notes || '',
      status: 'confirmed'
    });

    await appointment.save();

    // Populate user references for response
    await appointment.populate('clientId', 'name email');
    await appointment.populate('employeeId', 'name email');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment.' });
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
      // Match by employeeId or braiderId
      query.$or = [
        { employeeId: req.user._id },
        { braiderId: req.user.braiderId }
      ];
    }
    
    // Admins see all appointments
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
      .populate('employeeId', 'name email')
      .sort({ dateTime: -1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
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
    if (req.user.role === 'client' && appointment.clientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (req.user.role === 'employee' && 
        appointment.employeeId._id.toString() !== req.user._id.toString() &&
        appointment.braiderId !== req.user.braiderId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
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
    if (req.user.role === 'employee' && 
        appointment.employeeId.toString() !== req.user._id.toString() &&
        appointment.braiderId !== req.user.braiderId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const oldStatus = appointment.status;
    appointment.status = status;

    // If marking as completed, award points
    if (status === 'completed' && oldStatus !== 'completed') {
      // Award points based on service price (e.g., 1 point per dollar)
      const pointsToAward = Math.floor(appointment.servicePrice || 0);
      
      if (pointsToAward > 0) {
        let reward = await Reward.findOne({ clientId: appointment.clientId });
        if (!reward) {
          reward = new Reward({ clientId: appointment.clientId });
        }
        await reward.addPoints(pointsToAward, `Appointment completed: ${appointment.serviceName}`);
      }
    }

    // Track cancellation
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      appointment.cancelledAt = new Date();
      appointment.cancelledBy = req.user.role;
    }

    await appointment.save();

    res.json({
      message: 'Appointment status updated',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
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
    const isClientOwner = appointment.clientId.toString() === req.user._id.toString();
    const isEmployeeAssigned = req.user.role === 'employee' && 
      (appointment.employeeId.toString() === req.user._id.toString() || 
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

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
});

export default router;

