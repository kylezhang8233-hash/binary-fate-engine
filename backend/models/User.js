const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  freeLimit: {
    type: Number,
    default: 3
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Check if user is admin by email
userSchema.statics.isAdmin = function(email) {
  return email === 'binaryfateofficial@outlook.com';
};

// Create and export User model
const User = mongoose.model('User', userSchema);

module.exports = User;