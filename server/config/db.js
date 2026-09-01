const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5s timeout instead of 30s
    });

    isConnected = db.connections[0].readyState === 1;
    console.log(`✅ MongoDB Connected: ${db.connection.host}`);
    return db.connection;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
