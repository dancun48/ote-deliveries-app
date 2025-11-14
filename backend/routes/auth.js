import express from 'express';
import { authController } from '../controllers/authController.js';
import { validateRegistration, validateLogin, handleValidationErrors } from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import { emitToAdmins } from '../server.js';

const router = express.Router();

router.post('/register', validateRegistration, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.get('/me', auth, authController.getMe);
router.put('/me/profile', auth, authController.updateProfile);

export default router;