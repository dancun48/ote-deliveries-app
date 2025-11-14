import express from 'express';
import { deliveryController } from '../controllers/deliveryController.js';
import { validateDelivery, handleValidationErrors } from '../middleware/validation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all delivery routes
router.use(auth);

// Create delivery
router.post('/', validateDelivery, handleValidationErrors, deliveryController.createDelivery);

// Get user's deliveries
router.get('/my-deliveries', deliveryController.getUserDeliveries);

// Get all deliveries (for admin)
router.get('/', deliveryController.getAllDeliveries);

// Track delivery (public route - no auth required)
router.get('/track/:trackingNumber', deliveryController.trackDelivery);

export default router;