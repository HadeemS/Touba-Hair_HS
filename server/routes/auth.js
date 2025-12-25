import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import { validate, registerValidation, loginValidation, changePasswordValidation, createUserValidation } from '../middleware/validation.js';
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
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again.' });
  }
});

// Login - supports both email and username
router.post('/login', authLimiter, validate(loginValidation), async (req, res) => {
  const startTime = Date.now();
  const { email, username, password } = req.body;
  
  try {
    // Log login attempt (without sensitive data)
    const loginIdentifier = email || username;
    logger.info(`[LOGIN] Attempt: ${loginIdentifier} at ${new Date().toISOString()}`);
    
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

    if (!email && !username) {
      return res.status(400).json({ error: 'Email or username is required.' });
    }

    // Find user by email or username
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = await User.findOne({ username: username.toLowerCase() });
    }
    
    if (!user) {
      logger.warn(`[LOGIN] User not found: ${loginIdentifier}`);
      // Generic error message to prevent username enumeration
      return res.status(401).json({ 
        error: 'Invalid credentials.',
        hint: 'Check your username/email and password.'
      });
    }

    const userIdentifier = user.email || user.username || user.name;
    logger.info(`[LOGIN] User found: ${userIdentifier}, Role: ${user.role}, HasPassword: ${!!user.password}, IsActive: ${user.isActive}`);

    // Check if account is active
    if (!user.isActive) {
      logger.warn(`[LOGIN] Account inactive: ${userIdentifier}`);
      return res.status(403).json({ error: 'Account is inactive. Please contact support.' });
    }

    // For employees/admins, password is REQUIRED
    if (user.role === 'employee' || user.role === 'admin') {
      if (!password) {
        logger.warn(`[LOGIN] Password required but not provided for ${user.role}: ${userIdentifier}`);
        return res.status(400).json({ error: 'Password is required for this account type.' });
      }
      
      if (!user.password) {
        logger.warn(`[LOGIN] User has no password set: ${userIdentifier}`);
        return res.status(400).json({ 
          error: 'Account has no password set. Please contact support to set a password.'
        });
      }
      
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        logger.warn(`[LOGIN] Invalid password for: ${userIdentifier}`);
        // Generic error to prevent username enumeration
        return res.status(401).json({ 
          error: 'Invalid credentials.'
        });
      }
      
      logger.info(`[LOGIN] Password verified for: ${userIdentifier}`);
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

    logger.info(`[LOGIN] Success: ${userIdentifier} (${user.role}) - ${duration}ms`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        braiderId: user.braiderId || null,
        forcePasswordChange: user.forcePasswordChange || false
      },
      requiresPasswordChange: user.forcePasswordChange || false
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
    // Fetch fresh user data
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        braiderId: user.braiderId || null,
        notes: user.notes,
        forcePasswordChange: user.forcePasswordChange || false
      }
    });
  } catch (error) {
    logger.error('Get user error:', error);
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
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Change password
router.put('/change-password', authenticate, validate(changePasswordValidation), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Fetch user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // If forcePasswordChange is true, currentPassword is optional
    // Otherwise, currentPassword is required
    if (!user.forcePasswordChange) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required.' });
      }
      
      if (!user.password) {
        return res.status(400).json({ error: 'No password set for this account.' });
      }
      
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    }

    // Validate new password strength (already validated by middleware, but double-check)
    if (!newPassword || newPassword.length < 10) {
      return res.status(400).json({ error: 'New password must be at least 10 characters.' });
    }
    
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{10,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain at least one letter and one number.' });
    }

    // Update password (will be hashed by pre-save hook) and clear forcePasswordChange
    user.password = newPassword;
    user.forcePasswordChange = false;
    await user.save();

    logger.info(`[CHANGE_PASSWORD] Password changed for user: ${user.username || user.email || user.name}`);

    res.json({
      message: 'Password changed successfully',
      forcePasswordChange: false
    });
  } catch (error) {
    logger.error('Change password error:', error);
    if (error.message && error.message.includes('Password must be')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

// Initialize braider accounts from config (admin only)
router.post('/initialize-braiders', authenticate, async (req, res) => {
  try {
    // Only admins can initialize braiders
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can initialize braider accounts.' });
    }

    const { braiderCredentials } = await import('../config/braiderCredentials.js');
    const results = {
      created: [],
      updated: [],
      errors: []
    };

    for (const cred of braiderCredentials) {
      try {
        const existingUser = await User.findOne({ email: cred.email.toLowerCase() });
        
        if (existingUser) {
          // Update existing user
          existingUser.name = cred.name;
          existingUser.phone = cred.phone;
          existingUser.braiderId = cred.braiderId;
          existingUser.role = cred.role;
          existingUser.password = cred.password; // Will be hashed by pre-save hook
          existingUser.isActive = true;
          await existingUser.save();
          results.updated.push(cred.email);
        } else {
          // Create new user
          const newUser = new User({
            name: cred.name,
            email: cred.email.toLowerCase(),
            phone: cred.phone,
            password: cred.password,
            role: cred.role,
            braiderId: cred.braiderId,
            isActive: true
          });
          await newUser.save();
          results.created.push(cred.email);
        }
      } catch (error) {
        results.errors.push({ email: cred.email, error: error.message });
      }
    }

    res.json({
      message: 'Braider accounts initialized',
      results
    });
  } catch (error) {
    logger.error('Initialize braiders error:', error);
    res.status(500).json({ error: 'Failed to initialize braider accounts.' });
  }
});

// Get braider credentials list (admin only, without passwords)
router.get('/braider-credentials', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view braider credentials.' });
    }

    const { braiderCredentials } = await import('../config/braiderCredentials.js');
    
    // Return credentials without passwords for security
    const safeCredentials = braiderCredentials.map(cred => ({
      braiderId: cred.braiderId,
      name: cred.name,
      email: cred.email,
      phone: cred.phone,
      role: cred.role
    }));

    res.json({ credentials: safeCredentials });
  } catch (error) {
    logger.error('Get braider credentials error:', error);
    res.status(500).json({ error: 'Failed to fetch braider credentials.' });
  }
});

export default router;

