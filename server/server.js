const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Universal CORS middleware (handles headers & preflight)
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

app.use(cors(corsOptions));

// Explicit preflight handler for all routes
app.options('*', cors(corsOptions));

// 2. Custom header safeguard to guarantee CORS headers on every response (including errors)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '10mb' }));

// Root endpoint - no DB needed, instant response
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ZipTrip Todo API is live on Render!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check - tests DB connection
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbError = null;
  try {
    await connectDB();
    dbStatus = 'connected';
  } catch (err) {
    dbError = err.message;
  }
  res.status(200).json({
    status: 'ok',
    mongodb: { status: dbStatus, error: dbError },
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    timestamp: new Date().toISOString()
  });
});

// DB connection middleware for /api/todos routes
app.use('/api/todos', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Database Connection Error',
      message: err.message
    });
  }
}, todoRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Export for serverless environments (if any)
module.exports = app;

// Start server (for Render, local dev, Docker, etc.)
const PORT = process.env.PORT || 5000;
if (require.main === module || process.env.RENDER || process.env.NODE_ENV === 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    connectDB().catch(console.error);
    console.log(`Server running on port ${PORT}`);
  });
}

