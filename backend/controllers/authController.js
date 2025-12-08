import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { emitToAdmins } from '../server.js';

// Generate JWT Token
const generateToken = (userId, isAdmin = false) => {
  // Default to '7d' if env var is not set or invalid
  let expiresIn = '7d';
  
  if (process.env.JWT_EXPIRES_IN) {
    // Validate the expiresIn format
    const validFormats = ['d', 'h', 'm', 's'];
    const regex = new RegExp(`^\\d+(${validFormats.join('|')})$`);
    
    if (regex.test(process.env.JWT_EXPIRES_IN)) {
      expiresIn = process.env.JWT_EXPIRES_IN;
    } else {
      console.warn(`⚠️ Invalid JWT_EXPIRES_IN format: ${process.env.JWT_EXPIRES_IN}, using default '7d'`);
    }
  }
  
  return jwt.sign(
    { 
      userId, 
      isAdmin,
      timestamp: Date.now() 
    }, 
    process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
    { 
      expiresIn: expiresIn
    }
  );
};

export const authController = {
  // -----Register user------
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, phone, userType, companyName } = req.body;

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'User already exists with this email' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        userType: userType || 'personal',
        companyName
      });

      const token = generateToken(user.id, user.is_admin);

      // Emit event to admins
      if (user) {
        emitToAdmins('user_registered', {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
          createdAt: user.created_at,
          timestamp: new Date()
        });
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {  // CHANGED: Wrap in data object
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            userType: user.user_type,
            isAdmin: user.is_admin || false
          }
        }
      });

    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error during registration' 
      });
    }
  },

  // ------Login user------
  async login(req, res) {
  try {
    const { email, password } = req.body;
      console.log('Login attempt for:', email);
    
    // Find user
    const user = await User.findByEmail(email);    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);    
    if (!isPasswordValid) {
      console.log('PASSWORD MISMATCH!');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

      const token = generateToken(user.id, user.is_admin);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            userType: user.user_type,
            isAdmin: user.is_admin || false
          }
        }
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);

      res.status(500).json({ 
        success: false,
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // ------Get current user------
  async getMe(req, res) {
    try {
      console.log('👤 Fetching current user:', req.userId);
      
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            userType: user.user_type,
            phone: user.phone,
            companyName: user.company_name,
            isAdmin: user.is_admin || false,
            createdAt: user.created_at
          }
        }
      });

    } catch (error) {
      console.error('❌ Get user error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error' 
      });
    }
  },
  
  async updateProfile(req, res) {
  try {
    const { firstName, lastName, email, phone, companyName, userType } = req.body;
    const userId = req.userId;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is taken by another user
    if (email && email !== existingUser.email) {
      const userWithEmail = await User.findByEmail(email);
      if (userWithEmail && userWithEmail.id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    // Update user using User model
    const updatedUser = await User.update(userId, {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      userType
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found or update failed'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          phone: updatedUser.phone,
          userType: updatedUser.user_type,
          companyName: updatedUser.company_name,
          isAdmin: updatedUser.is_admin || false,
          createdAt: updatedUser.created_at
        }
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
}
};