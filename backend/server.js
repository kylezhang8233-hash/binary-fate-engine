require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const baziRoutes = require('./routes/bazi');
const userRoutes = require('./routes/user');
const shopifyModule = require('./routes/shopify');

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Atlas Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/binaryfate';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL // Add production frontend URL here
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/bazi', baziRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shopify', shopifyModule.router);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Binary Fate Engine API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});