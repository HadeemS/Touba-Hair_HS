// Environment variable validation
import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = {
  production: ['MONGODB_URI', 'JWT_SECRET'],
  development: []
};

export const validateEnv = () => {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || [];
  const missing = [];

  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    
    if (env === 'production') {
      throw new Error('Missing required environment variables. Please set them before starting the server.');
    } else {
      console.warn('⚠️  Continuing in development mode, but some features may not work.');
    }
  }

  // Warn about insecure defaults
  if (process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Change this in production!');
  }

  if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    console.warn('⚠️  WARNING: FRONTEND_URL not set. CORS may be too permissive.');
  }

  console.log('✅ Environment variables validated');
};

