require('dotenv').config();
const express = require('express');
const cors = require('cors');
const baziRoutes = require('./routes/bazi');

const app = express();
const PORT = process.env.PORT || 5001;

console.log('✅ Binary Fate Engine API initialized without MongoDB (user features removed)');

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