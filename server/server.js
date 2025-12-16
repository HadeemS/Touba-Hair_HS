import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import rewardRoutes from './routes/rewards.js';
import { validateEnv } from './utils/env.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (required for Render and other hosting platforms)
// MUST be set before any middleware that uses IP addresses (like rate limiting)
app.set('trust proxy', true);

// MongoDB connection
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/touba-hair';

// Fix MongoDB connection string - ensure proper format
if (MONGODB_URI && !MONGODB_URI.includes('<db_password>')) {
  const dbName = process.env.MONGODB_DB_NAME || 'touba-hair';

  try {
    // Parse and reconstruct the connection string properly
    if (MONGODB_URI.includes('mongodb+srv://')) {
      // Extract components from mongodb+srv:// connection
      const match = MONGODB_URI.match(/mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?/);

      if (match) {
        const credentials = match[1]; // username:password
        const host = match[2]; // cluster.mongodb.net
        const existingPath = match[3] || ''; // /database or empty
        const queryString = match[4] || ''; // ?options

        // Clean existing path (remove leading/trailing slashes)
        const cleanPath = existingPath.replace(/^\/+|\/+$/g, '');

        // Use existing database name if valid, otherwise use default
        const finalDbName = cleanPath && cleanPath.length > 0 ? cleanPath : dbName;

        // Reconstruct URI with proper format: mongodb+srv://credentials@host/database?options
        let newUri = `mongodb+srv://${credentials}@${host}/${finalDbName}`;

        // Add query parameters
        if (queryString) {
          // Merge retryWrites if not present
          if (!queryString.includes('retryWrites')) {
            newUri += `${queryString.includes('?') ? '&' : '?'}retryWrites=true&w=majority`;
          } else {
            newUri += queryString;
          }
        } else {
          // Add default query parameters
          newUri += `?retryWrites=true&w=majority`;
        }

        MONGODB_URI = newUri;
        logger.info(`MongoDB URI configured. Database: ${finalDbName}`);
      }
    } else if (MONGODB_URI.includes('mongodb://')) {
      // Standard MongoDB connection
      const match = MONGODB_URI.match(/mongodb:\/\/([^@]+@)?([^/]+)(\/[^?]*)?(\?.*)?/);

      if (match) {
        const auth = match[1] || ''; // username:password@ or empty
        const host = match[2]; // host:port
        const existingPath = match[3] || ''; // /database or empty
        const queryString = match[4] || ''; // ?options

        const cleanPath = existingPath.replace(/^\/+|\/+$/g, '');
        const finalDbName = cleanPath && cleanPath.length > 0 ? cleanPath : dbName;

        MONGODB_URI = `mongodb://${auth}${host}/${finalDbName}${queryString || ''}`;
        logger.info(`MongoDB URI configured. Database: ${finalDbName}`);
      }
    }
  } catch (error) {
    logger.error('Error parsing MongoDB URI:', error.message);
    logger.warn('Using original MONGODB_URI as-is');
  }
}

if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
  logger.error('MONGODB_URI not set or incomplete. Please set MONGODB_URI environment variable.');
  logger.error('Current MONGODB_URI:', MONGODB_URI ? 'Set but incomplete' : 'Not set');
} else {
  logger.info('Attempting to connect to MongoDB...');

  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // Increased to 30s for better reliability
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 2, // Maintain at least 2 socket connections
  })
    .then(() => {
      logger.info('MongoDB connected successfully');
      logger.info('Database Name:', mongoose.connection.name);
      logger.info('Host:', mongoose.connection.host);
      logger.info('Connection State:', 'Connected (Ready)');
      logger.info('Ready to accept database operations');

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err.message);
        logger.error('Check your MONGODB_URI and network access');
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected successfully');
      });
    })
    .catch((error) => {
      logger.error('MongoDB connection failed:', error.message);
      logger.error('Troubleshooting Steps:');
      logger.error('   1. Check MONGODB_URI environment variable is set');
      logger.error('   2. Verify username and password are correct');
      logger.error('   3. Ensure IP whitelist includes 0.0.0.0/0 (or your server IP)');
      logger.error('   4. Check MongoDB Atlas cluster is running');
      logger.error('   5. Verify network connectivity');
      logger.error('Connection String Format:');
      logger.error('   mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority');
      logger.error('Test Connection:');
      logger.error('   GET /api/test-db - Test database connection');
      logger.error('   GET /api/health - Check server and database status');

      // Retry connection logic
      let retries = 0;
      const maxRetries = 5;
      const retryDelay = 5000; // 5 seconds

      const retryConnection = () => {
        if (retries < maxRetries) {
          retries++;
          logger.warn(`Retrying MongoDB connection (${retries}/${maxRetries})...`);
          setTimeout(() => {
            mongoose.connect(MONGODB_URI, {
              serverSelectionTimeoutMS: 30000,
              socketTimeoutMS: 45000,
              maxPoolSize: 10,
              minPoolSize: 2,
            })
              .then(() => {
                logger.info('MongoDB reconnected successfully');
              })
              .catch((retryError) => {
                logger.error(`Retry ${retries} failed:`, retryError.message);
                retryConnection();
              });
          }, retryDelay);
        } else {
          logger.error('Max retries reached. MongoDB connection failed.');
        }
      };

      retryConnection();
    });
}

// Middleware
// CORS configuration - restrict in production
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hadeems.github.io',
  'https://hadeems.github.io/touba-hair_hs',
  'https://hadeems.github.io/Touba-Hair_HS',
  'https://touba-hair-hs-1.onrender.com' // ✅ optional, but helpful for direct testing
];

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : defaultAllowedOrigins;

const normalizeOrigin = (origin) => origin?.toLowerCase().replace(/\/+$/, '');

const isOriginAllowed = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return true;
  return allowedOrigins.some((allowed) => {
    const normalizedAllowed = normalizeOrigin(allowed);
    return normalizedOrigin === normalizedAllowed || normalizedOrigin.startsWith(normalizedAllowed);
  });
};

// ✅ FIXED CORS: do NOT throw errors in production; deny gracefully
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Render health checks, curl, Postman, etc.)
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === 'production') {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      logger.warn(`Blocked CORS origin: ${origin}`);
      return callback(null, false); // ✅ deny without crashing
    }

    // In development, allow all origins
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Token']
}));

app.use(express.json());
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    logger[logLevel](`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Ensure data directory exists
const dataDir = join(__dirname, 'data');
const galleryFile = join(dataDir, 'gallery.json');
const pricesFile = join(dataDir, 'prices.json');

async function ensureDataDir() {
  if (!existsSync(dataDir)) {
    await fs.mkdir(dataDir, { recursive: true });
  }

  // Initialize gallery.json if it doesn't exist
  if (!existsSync(galleryFile)) {
    await fs.writeFile(galleryFile, JSON.stringify([], null, 2));
  }

  // Initialize prices.json if it doesn't exist
  if (!existsSync(pricesFile)) {
    const defaultPrices = [
      {
        id: '1',
        name: 'Box Braids',
        description: 'Classic box braids with premium hair extensions',
        price: 150,
        duration: '4-6 hours',
        category: 'Braids'
      },
      {
        id: '2',
        name: 'Cornrows',
        description: 'Traditional cornrow braiding styles',
        price: 80,
        duration: '2-3 hours',
        category: 'Braids'
      },
      {
        id: '3',
        name: 'Goddess Braids',
        description: 'Elegant goddess braids with decorative elements',
        price: 180,
        duration: '5-7 hours',
        category: 'Braids'
      },
      {
        id: '4',
        name: 'Fulani Braids',
        description: 'Traditional Fulani braiding style',
        price: 160,
        duration: '4-6 hours',
        category: 'Braids'
      },
      {
        id: '5',
        name: 'Micro Braids',
        description: 'Fine micro braids for a delicate look',
        price: 200,
        duration: '6-8 hours',
        category: 'Braids'
      },
      {
        id: '6',
        name: 'Knotless Braids',
        description: 'Gentle knotless braids for hair protection',
        price: 170,
        duration: '5-7 hours',
        category: 'Braids'
      }
    ];
    await fs.writeFile(pricesFile, JSON.stringify(defaultPrices, null, 2));
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      fs.mkdir(uploadDir, { recursive: true }).then(() => {
        cb(null, uploadDir);
      });
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// Initialize data directory
await ensureDataDir();

// Helper functions to read/write JSON files
async function readGallery() {
  try {
    const data = await fs.readFile(galleryFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeGallery(gallery) {
  await fs.writeFile(galleryFile, JSON.stringify(gallery, null, 2));
}

async function readPrices() {
  try {
    const data = await fs.readFile(pricesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writePrices(prices) {
  await fs.writeFile(pricesFile, JSON.stringify(prices, null, 2));
}

// ==================== GALLERY ROUTES ====================

// Get all gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await readGallery();
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Get single gallery image
app.get('/api/gallery/:id', async (req, res) => {
  try {
    const gallery = await readGallery();
    const image = gallery.find(img => img.id === req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Add new gallery item (image or video)
app.post('/api/gallery', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media file provided' });
    }

    const gallery = await readGallery();
    const isVideo = req.file.mimetype.startsWith('video/');
    const mediaUrl = `/uploads/${req.file.filename}`;

    const newItem = {
      id: Date.now().toString(),
      type: isVideo ? 'video' : 'image',
      imageUrl: isVideo ? null : mediaUrl,
      videoUrl: isVideo ? mediaUrl : null,
      posterUrl: req.body.posterUrl || null,
      title: req.body.title || (isVideo ? 'Hair Style Video' : 'Hair Style'),
      description: req.body.description || '',
      braiderName: req.body.braiderName || '',
      serviceType: req.body.serviceType || '',
      createdAt: new Date().toISOString()
    };

    gallery.push(newItem);
    await writeGallery(gallery);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add media' });
  }
});

// Update gallery image
app.put('/api/gallery/:id', async (req, res) => {
  try {
    const gallery = await readGallery();
    const index = gallery.findIndex(img => img.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }

    gallery[index] = {
      ...gallery[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await writeGallery(gallery);
    res.json(gallery[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// Delete gallery item
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const gallery = await readGallery();
    const index = gallery.findIndex(img => img.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Delete the media file
    const item = gallery[index];
    if (item.imageUrl) {
      const mediaPath = join(__dirname, 'public', item.imageUrl);
      if (existsSync(mediaPath)) {
        await fs.unlink(mediaPath);
      }
    }
    if (item.videoUrl) {
      const mediaPath = join(__dirname, 'public', item.videoUrl);
      if (existsSync(mediaPath)) {
        await fs.unlink(mediaPath);
      }
    }
    if (item.posterUrl) {
      const posterPath = join(__dirname, 'public', item.posterUrl);
      if (existsSync(posterPath)) {
        await fs.unlink(posterPath);
      }
    }

    gallery.splice(index, 1);
    await writeGallery(gallery);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ==================== PRICES ROUTES ====================

// Get all prices
app.get('/api/prices', async (req, res) => {
  try {
    const prices = await readPrices();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// Get single price
app.get('/api/prices/:id', async (req, res) => {
  try {
    const prices = await readPrices();
    const price = prices.find(p => p.id === req.params.id);
    if (!price) {
      return res.status(404).json({ error: 'Price not found' });
    }
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

// Add new price
app.post('/api/prices', async (req, res) => {
  try {
    const prices = await readPrices();
    const newPrice = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    prices.push(newPrice);
    await writePrices(prices);

    res.status(201).json(newPrice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add price' });
  }
});

// Update price
app.put('/api/prices/:id', async (req, res) => {
  try {
    const prices = await readPrices();
    const index = prices.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Price not found' });
    }

    prices[index] = {
      ...prices[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await writePrices(prices);
    res.json(prices[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update price' });
  }
});

// Delete price
app.delete('/api/prices/:id', async (req, res) => {
  try {
    const prices = await readPrices();
    const index = prices.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Price not found' });
    }

    prices.splice(index, 1);
    await writePrices(prices);

    res.json({ message: 'Price deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete price' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/rewards', rewardRoutes);

// MongoDB connection status helper
const getMongoDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const readyState = mongoose.connection.readyState;
  return {
    status: states[readyState] || 'unknown',
    readyState: readyState,
    isConnected: readyState === 1,
    host: mongoose.connection.host || 'N/A',
    port: mongoose.connection.port || 'N/A',
    name: mongoose.connection.name || 'N/A'
  };
};

// Health check with detailed MongoDB status
app.get('/api/health', (req, res) => {
  const mongoStatus = getMongoDBStatus();
  const isHealthy = mongoStatus.isConnected;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    database: {
      ...mongoStatus,
      message: mongoStatus.isConnected
        ? 'MongoDB is connected and ready'
        : `MongoDB is ${mongoStatus.status}. Check connection string and network access.`
    },
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  });
});

// Create admin account endpoint
app.post('/api/auth/create-admin', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { name = 'Admin', email = 'admin@toubahair.com', password = 'Admin123!@#' } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // Update existing user's password if it exists
      existingUser.password = password;
      existingUser.isActive = true;
      await existingUser.save();

      return res.status(200).json({
        message: 'Admin account updated (password reset)',
        user: {
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role
        }
      });
    }

    const admin = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      isActive: true
    });

    await admin.save();

    res.status(201).json({
      message: 'Admin account created',
      user: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    logger.error('Create admin error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create all demo users endpoint
app.post('/api/auth/create-demo-users', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@toubahair.com',
        password: 'Admin123!@#',
        role: 'admin'
      },
      {
        name: 'Mariama',
        email: 'mariama@toubahair.com',
        password: 'Employee123!',
        role: 'employee',
        braiderId: '3'
      },
      {
        name: 'Amina',
        email: 'amina@toubahair.com',
        password: 'Employee123!',
        role: 'employee',
        braiderId: '1'
      },
      {
        name: 'Fatou',
        email: 'fatou@toubahair.com',
        password: 'Employee123!',
        role: 'employee',
        braiderId: '2'
      },
      {
        name: 'Aissatou',
        email: 'aissatou@toubahair.com',
        password: 'Employee123!',
        role: 'employee',
        braiderId: '4'
      },
      {
        name: 'Test Customer',
        email: 'customer1@example.com',
        password: 'Customer123!',
        role: 'client'
      }
    ];

    const results = {
      created: [],
      updated: [],
      errors: []
    };

    for (const userData of demoUsers) {
      try {
        const existingUser = await User.findOne({ email: userData.email.toLowerCase() });

        if (existingUser) {
          // Update existing user
          existingUser.name = userData.name;
          existingUser.password = userData.password;
          existingUser.role = userData.role;
          existingUser.isActive = true;
          if (userData.braiderId) {
            existingUser.braiderId = userData.braiderId;
          }
          await existingUser.save();
          results.updated.push({
            email: userData.email,
            role: userData.role
          });
        } else {
          // Create new user
          const user = new User({
            name: userData.name,
            email: userData.email.toLowerCase(),
            password: userData.password,
            role: userData.role,
            braiderId: userData.braiderId || null,
            isActive: true
          });
          await user.save();
          results.created.push({
            email: userData.email,
            role: userData.role
          });
        }
      } catch (userError) {
        results.errors.push({
          email: userData.email,
          error: userError.message
        });
      }
    }

    res.status(200).json({
      message: 'Demo users processed',
      results: {
        created: results.created.length,
        updated: results.updated.length,
        errors: results.errors.length
      },
      details: results
    });
  } catch (error) {
    logger.error('Create demo users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// MongoDB connection test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const mongoStatus = getMongoDBStatus();

    if (!mongoStatus.isConnected) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB is not connected',
        status: mongoStatus,
        troubleshooting: {
          checkConnectionString: 'Verify MONGODB_URI environment variable is set correctly',
          checkIPWhitelist: 'Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0 or your server IP',
          checkCredentials: 'Verify username and password are correct',
          checkNetwork: 'Check if MongoDB Atlas cluster is accessible'
        }
      });
    }

    // Try a simple database operation
    const testResult = await mongoose.connection.db.admin().ping();

    res.json({
      success: true,
      message: 'MongoDB connection is working!',
      status: mongoStatus,
      test: {
        ping: testResult,
        database: mongoose.connection.name,
        collections: await mongoose.connection.db.listCollections().toArray()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'MongoDB test failed',
      message: error.message,
      status: getMongoDBStatus()
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Touba Hair API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      appointments: '/api/appointments',
      rewards: '/api/rewards',
      gallery: '/api/gallery',
      prices: '/api/prices',
      health: '/api/health'
    }
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Gallery API: http://localhost:${PORT}/api/gallery`);
  logger.info(`Prices API: http://localhost:${PORT}/api/prices`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
