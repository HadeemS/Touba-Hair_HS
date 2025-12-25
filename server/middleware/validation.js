import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ 
      error: 'Validation failed',
      message: errorMessages,
      errors: errors.array()
    });
  };
};

// Common validation rules
export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role').optional().isIn(['client', 'employee', 'admin']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').notEmpty().withMessage('Password is required'),
  body().custom((value, { req }) => {
    // Either email or username must be provided
    if (!req.body.email && !req.body.username) {
      throw new Error('Either email or username is required');
    }
    return true;
  })
];

export const changePasswordValidation = [
  body('currentPassword').optional().notEmpty().withMessage('Current password cannot be empty if provided'),
  body('newPassword')
    .isLength({ min: 10 }).withMessage('Password must be at least 10 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

export const createUserValidation = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('location').isIn(['Sandhills', 'Two Notch']).withMessage('Location must be Sandhills or Two Notch'),
  body('role').isIn(['employee', 'admin']).withMessage('Role must be employee or admin'),
  body('password').optional().isLength({ min: 10 }).withMessage('Password must be at least 10 characters')
];

export const appointmentValidation = [
  body('braiderId').notEmpty().withMessage('Braider ID is required'),
  body('braiderName').trim().notEmpty().withMessage('Braider name is required'),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('timeSlot')
    .notEmpty().withMessage('Time slot is required')
    .matches(/^\d{1,2}:\d{2}\s?(AM|PM)$/i).withMessage('Time slot must be in format "HH:MM AM/PM"'),
  body('customerName').trim().isLength({ min: 2 }).withMessage('Customer name must be at least 2 characters'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('customerPhone')
    .trim()
    .notEmpty().withMessage('Customer phone is required')
    .isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters')
];

