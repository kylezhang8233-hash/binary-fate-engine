const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST route for user registration
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(200).json({ 
        message: 'User already exists', 
        user: { 
          email: user.email, 
          usageCount: user.usageCount, 
          freeLimit: user.freeLimit, 
          isPremium: user.isPremium 
        } 
      });
    }
    
    // Check if user is admin
    const isAdmin = User.isAdmin(email);
    
    // Create new user
    user = new User({
      email,
      usageCount: 0,
      freeLimit: isAdmin ? 9999 : 3, // Unlimited for admin
      isPremium: isAdmin, // Admin gets premium access
      isAdmin: isAdmin
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { 
        email: user.email, 
        usageCount: user.usageCount, 
        freeLimit: user.freeLimit, 
        isPremium: user.isPremium 
      } 
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST route for user login
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    let user = await User.findOne({ email });
    
    // If user doesn't exist, create a new one
    if (!user) {
      const isAdmin = User.isAdmin(email);
      
      user = new User({
        email,
        usageCount: 0,
        freeLimit: isAdmin ? 9999 : 3,
        isPremium: isAdmin,
        isAdmin: isAdmin
      });
      
      await user.save();
      
      console.log('New user created during login:', email, isAdmin ? '(ADMIN)' : '');
    }
    
    res.json({ 
      message: 'Login successful', 
      user: { 
        email: user.email, 
        usageCount: user.usageCount, 
        freeLimit: user.freeLimit, 
        isPremium: user.isPremium 
      } 
    });
    
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET route for user profile
router.get('/profile', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create user if not found
      const isAdmin = User.isAdmin(email);
      
      user = new User({
        email,
        usageCount: 0,
        freeLimit: isAdmin ? 9999 : 3,
        isPremium: isAdmin,
        isAdmin: isAdmin
      });
      
      await user.save();
      console.log('New user created in profile:', email, isAdmin ? '(ADMIN)' : '');
    }
    
    res.json({ 
      user: { 
        email: user.email, 
        usageCount: user.usageCount, 
        freeLimit: user.freeLimit, 
        isPremium: user.isPremium 
      } 
    });
    
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// GET route to fetch current usage count
router.get('/usage/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create user if not found
      const isAdmin = User.isAdmin(email);
      
      user = new User({
        email,
        usageCount: 0,
        freeLimit: isAdmin ? 9999 : 3,
        isPremium: isAdmin,
        isAdmin: isAdmin
      });
      
      await user.save();
      console.log('New user created in usage:', email, isAdmin ? '(ADMIN)' : '');
    }
    
    console.log('Found user for usage:', user.email, 'Usage count:', user.usageCount);
    
    res.json({
      usageCount: user.usageCount,
      freeLimit: user.freeLimit,
      isPremium: user.isPremium
    });
    
  } catch (error) {
    console.error('Error fetching usage count:', error);
    res.status(500).json({ error: 'Failed to fetch usage count' });
  }
});

// POST route to increment usage count
router.post('/usage', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log('Usage request received:', { email });
    
    // Find user by email
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Found user for usage update:', user.email, 'Current usage:', user.usageCount);
    
    // Check if user has free usage left or is premium
    if (!user.isPremium && user.usageCount >= user.freeLimit) {
      return res.status(403).json({ error: 'Free usage limit exceeded. Please upgrade to premium.' });
    }
    
    // Increment usage count
    user.usageCount += 1;
    await user.save();
    
    console.log('After increment - User:', user.email, 'Usage:', user.usageCount);
    
    res.json({ 
      message: 'Usage count updated', 
      usageCount: user.usageCount, 
      remainingFree: user.isPremium ? 'Unlimited' : user.freeLimit - user.usageCount 
    });
    
  } catch (error) {
    console.error('Error updating usage count:', error);
    res.status(500).json({ error: 'Failed to update usage count' });
  }
});

module.exports = router;