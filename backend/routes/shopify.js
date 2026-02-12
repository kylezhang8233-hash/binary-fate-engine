const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST route to manually upgrade user to premium
router.post('/upgrade', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user to premium
    user.isPremium = true;
    user.freeLimit = 9999; // Unlimited usage for premium users
    
    await user.save();
    
    console.log(`User ${email} upgraded to premium`);
    
    // Return success response
    res.json({ 
      message: 'User upgraded to premium', 
      user: { 
        email: user.email, 
        isPremium: user.isPremium, 
        freeLimit: user.freeLimit,
        usageCount: user.usageCount
      } 
    });
    
  } catch (error) {
    console.error('Error upgrading user:', error);
    res.status(500).json({ error: 'Failed to upgrade user' });
  }
});

// GET route to check user subscription status
router.get('/subscription/status', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      isPremium: user.isPremium,
      subscriptionStatus: user.isPremium ? 'active' : 'inactive',
      usageCount: user.usageCount,
      freeLimit: user.freeLimit,
      email: user.email
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
});

module.exports = {
  router
};