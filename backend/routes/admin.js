import express from 'express';
import { adminController } from '../controllers/adminController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// Check if user is admin middleware
const requireAdmin = (req, res, next) => {  
  if (!req.user.is_admin) {
    console.log('❌ Access denied - user is not admin:', req.user.email);
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  console.log('✅ User is admin, granting access');
  next();
};

router.use(requireAdmin);

// Admin routes
router.get('/users', adminController.getAllUsers);
router.get('/stats', adminController.getDashboardStats);
router.get('/deliveries', adminController.getAllDeliveries);
router.patch('/deliveries/:deliveryId/status', adminController.updateDeliveryStatus);
router.patch('/deliveries/:deliveryId/assign-driver', adminController.assignDriverToDelivery);
router.post('/users', adminController.createUser);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);
router.get('/drivers/available', adminController.getAvailableDrivers);
router.get('/users/:userId/deliveries', adminController.getUserDeliveries);

export default router;