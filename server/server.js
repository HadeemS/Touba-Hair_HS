import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/touba-hair';

if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
  console.error('❌ MONGODB_URI not set or incomplete. Please set MONGODB_URI environment variable.');
  console.error('⚠️  Current MONGODB_URI:', MONGODB_URI ? 'Set but incomplete' : 'Not set');
} else {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Timeout after 10s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    logger.info('✅ Connected to MongoDB');
    logger.info('📊 Database:', mongoose.connection.name);
  })
  .catch((error) => {
    logger.error('❌ MongoDB connection error:', error.message);
    logger.error('⚠️  Check your MONGODB_URI environment variable in Render');
    logger.error('⚠️  Make sure:');
    logger.error('   1. Password is correct and URL-encoded');
    logger.error('   2. IP whitelist includes 0.0.0.0/0');
    logger.error('   3. Database name is included in connection string');
    logger.error('   4. Connection string format: mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority');
    
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
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
          })
          .then(() => {
            logger.info('✅ MongoDB reconnected successfully');
          })
          .catch((retryError) => {
            logger.error(`Retry ${retries} failed:`, retryError.message);
            retryConnection();
          });
        }, retryDelay);
      } else {
        logger.error('❌ Max retries reached. MongoDB connection failed.');
      }
    };
    
    retryConnection();
  });
}

// Middleware
// CORS configuration - restrict in production
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'https://hadeems.github.io'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === 'production') {
      // In production, only allow specific origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
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

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
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
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📸 Gallery API: http://localhost:${PORT}/api/gallery`);
  logger.info(`💰 Prices API: http://localhost:${PORT}/api/prices`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

