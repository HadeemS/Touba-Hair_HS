import express from 'express';
import User from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, createUserValidation } from '../middleware/validation.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get all users (with optional filtering)
router.get('/users', async (req, res) => {
  try {
    const { location, role } = req.query;
    const query = {};
    
    if (location) {
      query.location = location;
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ location: 1, name: 1 });

    res.json({
      users: users.map(user => ({
        id: user._id,
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        isActive: user.isActive,
        forcePasswordChange: user.forcePasswordChange,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Create new user (employee or admin)
router.post('/users', validate(createUserValidation), async (req, res) => {
  try {
    const { fullName, username, email, location, role, password } = req.body;

    // Generate username if not provided
    let finalUsername = username;
    if (!finalUsername && fullName) {
      finalUsername = User.generateUsername(fullName);
    }

    // Check for duplicate username
    if (finalUsername) {
      let existingUser = await User.findOne({ username: finalUsername.toLowerCase() });
      let counter = 1;
      while (existingUser) {
        finalUsername = `${User.generateUsername(fullName)}${counter}`;
        existingUser = await User.findOne({ username: finalUsername.toLowerCase() });
        counter++;
      }
    }

    // Check for duplicate email if provided
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
    }

    // Generate temp password if not provided
    let tempPassword = password;
    if (!tempPassword) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      tempPassword = `Touba!${randomSuffix}`;
    }

    const user = new User({
      name: fullName, // Keep name for backward compatibility
      fullName,
      username: finalUsername ? finalUsername.toLowerCase() : undefined,
      email: email ? email.toLowerCase() : undefined,
      location,
      role,
      password: tempPassword,
      forcePasswordChange: true // Force password change on first login
    });

    await user.save();

    logger.info(`[ADMIN] User created: ${fullName} (${role}) at ${location}`);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        location: user.location,
        role: user.role,
        forcePasswordChange: user.forcePasswordChange
      },
      tempPassword: tempPassword // Return temp password for admin to share
    });
  } catch (error) {
    logger.error('Create user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// Update user
router.patch('/users/:id', async (req, res) => {
  try {
    const { fullName, username, email, location, role, isActive } = req.body;
    const updates = {};

    if (fullName !== undefined) {
      updates.name = fullName; // Keep name for backward compatibility
      updates.fullName = fullName;
    }
    if (username !== undefined) {
      updates.username = username.toLowerCase();
    }
    if (email !== undefined) {
      updates.email = email.toLowerCase();
    }
    if (location !== undefined) {
      updates.location = location;
    }
    if (role !== undefined) {
      updates.role = role;
    }
    if (isActive !== undefined) {
      updates.isActive = isActive;
    }

    // Check for duplicates if updating username or email
    if (updates.username) {
      const existingUser = await User.findOne({ 
        username: updates.username,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
    }
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    logger.info(`[ADMIN] User updated: ${user.fullName || user.name} (${req.params.id})`);

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        location: user.location,
        role: user.role,
        isActive: user.isActive,
        forcePasswordChange: user.forcePasswordChange
      }
    });
  } catch (error) {
    logger.error('Update user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Reset user password (admin only)
router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate new temp password
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const tempPassword = `Touba!${randomSuffix}`;

    user.password = tempPassword;
    user.forcePasswordChange = true;
    await user.save();

    logger.info(`[ADMIN] Password reset for user: ${user.fullName || user.name} (${req.params.id})`);

    res.json({
      message: 'Password reset successfully',
      tempPassword: tempPassword
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

export default router;


