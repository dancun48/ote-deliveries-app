import { body, validationResult } from 'express-validator';

// Validation rules
export const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim().escape(),
  body('lastName').notEmpty().trim().escape()
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

export const validateDelivery = [
  body('pickupAddress').notEmpty().trim(),
  body('deliveryAddress').notEmpty().trim(),
  body('recipientName').notEmpty().trim().escape(),
  body('recipientPhone').notEmpty().trim()
];

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};