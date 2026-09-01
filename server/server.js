const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins and headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// Root endpoint (Diagnostic - does not require DB)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 ZipTrip Todo API is live!',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      todos: '/api/todos',
      stats: '/api/todos/stats'
    }
  });
});

// Health check endpoint (Diagnostic - tests DB connection)
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbError = null;

  try {
    await connectDB();
    dbStatus = 'connected';
  } catch (err) {
    dbError = err.message;
  }

  res.json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'local-node',
    mongodb: {
      status: dbStatus,
      error: dbError,
      hasMongoUri: !!process.env.MONGODB_URI
    },
    timestamp: new Date().toISOString()
  });
});

// Middleware to ensure DB connection before executing Todo routes
const ensureDbConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed in route:', error.message);
    res.status(500).json({
      success: false,
      error: 'Database Connection Error',
      message: error.message || 'Failed to connect to MongoDB. Please ensure MONGODB_URI is set in Vercel environment variables and 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.'
    });
  }
};

// Todo Routes protected by DB connection
app.use('/api/todos', ensureDbConnection, todoRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Only listen locally (not in serverless environments)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export app for Vercel Serverless Function
module.exports = app;
