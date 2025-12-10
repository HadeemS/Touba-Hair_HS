import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import { validate, registerValidation, loginValidation } from '../middleware/validation.js';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Rate limiting for auth routes (more lenient for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window (increased from 5)
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Register new user
router.post('/register', validate(registerValidation), async (req, res) => {
  try {
    const { name, email, phone, password, role = 'client' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // For employees/admins, password is required
    if ((role === 'employee' || role === 'admin') && !password) {
      return res.status(400).json({ error: 'Password is required for employees and admins.' });
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password: password || undefined, // Only set if provided
      role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        braiderId: user.braiderId || null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again.' });
  }
});

// Login
router.post('/login', authLimiter, validate(loginValidation), async (req, res) => {
  const startTime = Date.now();
  const { email, password } = req.body;
  
  try {
    // Log login attempt (without sensitive data)
    logger.info(`[LOGIN] Attempt: ${email} at ${new Date().toISOString()}`);
    
    // Check MongoDB connection first
    const dbState = mongoose.connection.readyState;
    if (dbState !== 1) {
      const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
      logger.error(`[LOGIN] Database not ready. State: ${states[dbState] || 'unknown'} (${dbState})`);
      return res.status(503).json({ 
        error: 'Database connection unavailable. Please try again later.',
        databaseStatus: states[dbState] || 'unknown',
        readyState: dbState
      });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.warn(`[LOGIN] User not found: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid email or password.',
        hint: 'User does not exist. Use /api/auth/create-demo-users to create demo accounts.'
      });
    }

    logger.info(`[LOGIN] User found: ${user.email}, Role: ${user.role}, HasPassword: ${!!user.password}, IsActive: ${user.isActive}`);

    // Check if account is active
    if (!user.isActive) {
      logger.warn(`[LOGIN] Account inactive: ${email}`);
      return res.status(403).json({ error: 'Account is inactive. Please contact support.' });
    }

    // For employees/admins, password is REQUIRED
    if (user.role === 'employee' || user.role === 'admin') {
      if (!password) {
        logger.warn(`[LOGIN] Password required but not provided for ${user.role}: ${email}`);
        return res.status(400).json({ error: 'Password is required for this account type.' });
      }
      
      if (!user.password) {
        logger.warn(`[LOGIN] User has no password set: ${email}`);
        return res.status(400).json({ 
          error: 'Account has no password set. Please contact support to set a password.',
          hint: 'Use /api/auth/create-demo-users to reset password.'
        });
      }
      
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        logger.warn(`[LOGIN] Invalid password for: ${email}`);
        return res.status(401).json({ 
          error: 'Invalid email or password.',
          hint: 'Password may have been changed. Use /api/auth/create-demo-users to reset.'
        });
      }
      
      logger.info(`[LOGIN] Password verified for: ${email}`);
    } else {
      // For clients, password is optional but if provided, must be valid
      if (password && user.password) {
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          logger.warn(`[LOGIN] Invalid password for client: ${email}`);
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
        logger.info(`[LOGIN] Client password verified: ${email}`);
      } else if (password && !user.password) {
        // Client provided password but account has none - allow login (they can set password later)
        logger.info(`[LOGIN] Client ${email} provided password but account has none - allowing login`);
      } else {
        logger.info(`[LOGIN] Client login without password: ${email}`);
      }
    }

    // Generate token
    const token = generateToken(user._id);
    const duration = Date.now() - startTime;

    console.log(`[LOGIN] Success: ${email} (${user.role}) - ${duration}ms`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        braiderId: user.braiderId || null
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`[LOGIN] Error for ${email} after ${duration}ms:`, {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoServerError' || error.name === 'MongooseError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        error: 'Database connection error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to login. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        braiderId: req.user.braiderId || null,
        notes: req.user.notes
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, notes, email } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (notes !== undefined) updates.notes = notes;
    
    // Email change requires verification
    if (email && email !== req.user.email) {
      // Check if new email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use by another account.' });
      }
      updates.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        notes: user.notes
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Change password
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }
    
    // Check password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // If user has a password, verify current password (for employees/admins/clients with passwords)
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required.' });
      }

      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    } else {
      // For clients without a password, currentPassword is optional
      // This allows setting a password for the first time
      if (currentPassword) {
        return res.status(400).json({ error: 'You don\'t have a password set. Leave current password empty to set a new password.' });
      }
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

export default router;

