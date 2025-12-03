import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('❌ User not found for token');
      return res.status(401).json({ 
        success: false,
        message: 'Token is invalid.' 
      });
    }

    req.userId = decoded.userId;
    req.user = user;
    
    console.log('✅ Authenticated user:', user.email, 'Admin:', user.isAdmin);
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid.' 
    });
  }
};

export default auth;