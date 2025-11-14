// routes/drivers.js
import express from 'express';
import { driversController } from '../controllers/driversController.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// All driver routes require authentication
router.use(auth);

// Check if user is admin middleware
const requireAdmin = (req, res, next) => {
  console.log('🔐 Checking admin privileges for driver routes:', req.user.email);
  
  if (!req.user.is_admin) {
    console.log('❌ Access denied - user is not admin:', req.user.email);
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  console.log('✅ User is admin, granting access to driver routes');
  next();
};

router.use(requireAdmin);

// Validation rules
const validateCreateDriver = [
  body('name').notEmpty().trim().escape().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().trim().withMessage('Phone number is required'),
  body('vehicle_type').notEmpty().trim().withMessage('Vehicle type is required'),
  body('license_plate').notEmpty().trim().withMessage('License plate is required')
];

const validateUpdateDriver = [
  body('name').optional().notEmpty().trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().notEmpty().trim(),
  body('vehicle_type').optional().notEmpty().trim(),
  body('license_plate').optional().notEmpty().trim()
];

const validateUpdateStatus = [
  body('is_active').isBoolean().withMessage('is_active must be a boolean')
];

// Validation middleware
const handleValidationErrors = (req, res, next) => {
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

// Driver routes
router.get('/', driversController.getAllDrivers);
router.get('/:driverId', driversController.getDriverById);
router.post('/', validateCreateDriver, handleValidationErrors, driversController.createDriver);
router.patch('/:driverId/status', validateUpdateStatus, handleValidationErrors, driversController.updateDriverStatus);
router.put('/:driverId', validateUpdateDriver, handleValidationErrors, driversController.updateDriver);

export default router;