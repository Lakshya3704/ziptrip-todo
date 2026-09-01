const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Must be first - handle OPTIONS preflight and CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));

// Root endpoint - no DB needed, instant response
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ZipTrip Todo API is live!',
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

// DB connection middleware only for /api/todos routes
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

// Export for Vercel serverless
module.exports = app;

// Listen only when running locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    connectDB().catch(console.error);
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
