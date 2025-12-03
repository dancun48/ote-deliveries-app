// middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  // Check if user is admin
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

export default adminAuth;