const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'No authorization header',
        message: 'Authorization header is required'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Invalid authorization format',
        message: 'Authorization header must start with "Bearer "'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Bearer token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is malformed or invalid'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'The provided token has expired'
      });
    }

    console.error('Token verification error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify token'
    });
  }
};

/**
 * Middleware to require specific user types
 */
const requireUserType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'User not authenticated',
        message: 'Authentication required'
      });
    }

    const userType = req.user.userType;
    const allowed = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

    if (!allowed.includes(userType)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This endpoint requires one of the following user types: ${allowed.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Middleware to require creator user type
 */
const requireCreator = requireUserType('creator');

/**
 * Middleware to require consumer user type
 */
const requireConsumer = requireUserType('consumer');

/**
 * Optional authentication middleware
 * Adds user info if token is valid, but doesn't require authentication
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType
    };

    next();

  } catch (error) {
    // If token is invalid, continue without user info
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requireUserType,
  requireCreator,
  requireConsumer,
  optionalAuth
};
