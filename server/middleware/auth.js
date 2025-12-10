import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Validate JWT_SECRET on startup
const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER; // Render always sets RENDER env var

if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
  console.error('⚠️  WARNING: JWT_SECRET is not set or using default value!');
  console.error('⚠️  Set JWT_SECRET environment variable in production!');
  if (isProduction) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ JWT_SECRET is required in production!');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('To fix this:');
    console.error('1. Go to Render Dashboard → Your Service → Environment');
    console.error('2. Add environment variable: JWT_SECRET');
    console.error('3. Generate a strong random string (32+ characters)');
    console.error('4. Save and redeploy');
    console.error('');
    console.error('Generate JWT_SECRET:');
    console.error('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    throw new Error('JWT_SECRET must be set in production environment. See logs above for instructions.');
  }
}
const SECRET = JWT_SECRET || 'development-secret-key-only';

// Middleware to verify JWT token (required)
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided. Authentication required.' });
    }

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    res.status(500).json({ error: 'Authentication error.' });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'];
    
    if (!token) {
      req.user = null; // No user, but continue
      return next();
    }

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // If token is invalid, just continue without user (guest booking)
    req.user = null;
    next();
  }
};

// Middleware to check if user is employee or admin
export const requireEmployee = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  
  if (req.user.role !== 'employee' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Employee access required.' });
  }
  
  next();
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  
  next();
};

// Helper to generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' }); // 7 days expiry
};

export { SECRET as JWT_SECRET };

