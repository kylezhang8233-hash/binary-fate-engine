import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    gender: 'male',
    birthDate: '',
    birthTime: '',
    question: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [activePage, setActivePage] = useState('home'); // home, privacy, terms

  // API Base URL - HARDCODED FOR FINAL FIX
  const API_BASE_URL = 'https://binary-fate-backend.onrender.com';

  // Load user data from localStorage and sync with backend
  useEffect(() => {
    const savedUser = localStorage.getItem('binaryFateUser');
    const savedEmail = localStorage.getItem('binaryFateEmail');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Sync usage count with backend if email exists
      if (parsedUser.email) {
        syncUsageCount(parsedUser.email, parsedUser);
      }
    }
    
    if (savedEmail) {
      setEmail(savedEmail);
      // Sync usage count with backend using saved email
      if (savedEmail) {
        syncUsageCount(savedEmail);
      }
    }
  }, []);

  // Function to sync usage count with backend
  const syncUsageCount = async (email, currentUser = null) => {
    try {
      console.log('Syncing usage count for email:', email);
      const response = await axios.get(`${API_BASE_URL}/api/user/usage/${email}`);
      console.log('Sync response:', response.data);
      
      // Update user if we have a user object
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          usageCount: response.data.usageCount,
          freeLimit: response.data.freeLimit,
          isPremium: response.data.isPremium
        };
        setUser(updatedUser);
        localStorage.setItem('binaryFateUser', JSON.stringify(updatedUser));
        console.log('Synced user usage to:', updatedUser.usageCount);
      }
    } catch (error) {
      console.error('Error syncing usage count:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Registering with email:', email);
      const response = await axios.post(`${API_BASE_URL}/api/user/register`, { email });
      console.log('Register response:', response.data);
      setUser(response.data.user);
      localStorage.setItem('binaryFateUser', JSON.stringify(response.data.user));
      localStorage.setItem('binaryFateEmail', email);
      setShowLogin(false);
    } catch (err) {
      console.error('Register error:', err);
      setError('Failed to register user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is logged in
      if (!user) {
        throw new Error('Please register first');
      }
      
      // Check usage limit
      if (!user.isPremium && user.usageCount >= user.freeLimit) {
        throw new Error('Free usage limit exceeded. Please upgrade to premium.');
      }
      
      // Increment usage count - simplified using email instead of JWT for demo
      const usageEmail = email || user?.email || localStorage.getItem('binaryFateEmail');
      console.log('Sending usage request with email:', usageEmail, 'Current usage:', user.usageCount);
      
      // Get the actual updated usage count from backend
      const usageResponse = await axios.post(`${API_BASE_URL}/api/user/usage`, { email: usageEmail });
      console.log('Usage response:', usageResponse.data);
      
      // Get Bazi analysis
      const baziResponse = await axios.post(`${API_BASE_URL}/api/bazi/analyze`, formData);
      setResult(baziResponse.data);
      
      // Update user data with actual usage count from backend
      const updatedUser = {
        ...user,
        usageCount: usageResponse.data.usageCount
      };
      setUser(updatedUser);
      localStorage.setItem('binaryFateUser', JSON.stringify(updatedUser));
      console.log('Updated user usage count to:', updatedUser.usageCount);
      
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Show confirmation dialog
      const confirmUpgrade = window.confirm('Are you sure you want to upgrade to premium? This will give you unlimited access to Binary Fate Engine.');
      
      if (confirmUpgrade) {
        console.log('Upgrading user to premium:', user.email);
        
        // Call manual upgrade API
        const response = await axios.post(`${API_BASE_URL}/api/shopify/upgrade`, { email: user.email });
        console.log('Upgrade response:', response.data);
        
        // Update user state with new premium status
        setUser(prevUser => ({
          ...prevUser,
          isPremium: response.data.user.isPremium,
          freeLimit: response.data.user.freeLimit
        }));
        
        // Update localStorage
        localStorage.setItem('binaryFateUser', JSON.stringify({
          ...user,
          isPremium: response.data.user.isPremium,
          freeLimit: response.data.user.freeLimit
        }));
        
        alert('Successfully upgraded to premium! Enjoy unlimited access.');
      }
      
    } catch (err) {
      console.error('Upgrade error:', err);
      setError(err.response?.data?.error || 'Failed to upgrade to premium');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('handleLogout called!');
    // Clear all user data from localStorage
    localStorage.clear();
    
    // Reset all state
    setUser(null);
    setEmail('');
    setShowLogin(false);
    setResult(null);
    setError(null);
    setActivePage('home');
    
    // Clear form data
    setFormData({
      gender: 'male',
      birthDate: '',
      birthTime: '',
      question: ''
    });
    
    console.log('Successfully logged out - all data cleared!');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Binary Fate</h1>
        <p>The Four Pillars Decision Tool</p>
      </header>

      <main>
        {activePage === 'privacy' && (
          <section className="privacy-policy">
            <h2>Privacy Policy</h2>
            <h3>1. Information We Collect</h3>
            <p>We collect personal information that you voluntarily provide to us when registering for an account, such as your email address.</p>
            
            <h3>2. How We Use Your Information</h3>
            <p>We use your information to provide and improve our services, communicate with you, and manage your account and subscription status.</p>
            
            <h3>3. Information Sharing</h3>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties except as required by law or to process payments through Shopify.</p>
            
            <h3>4. Data Security</h3>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, or modification.</p>
            
            <h3>5. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal information. Please contact us for assistance.</p>
            
            <button onClick={() => setActivePage('home')} style={{ marginTop: '2rem' }}>Back to Home</button>
          </section>
        )}
        
        {activePage === 'terms' && (
          <section className="terms-of-service">
            <h2>Terms of Service</h2>
            <h3>1. Acceptance of Terms</h3>
            <p>By using Binary Fate, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>
            
            <h3>2. Free Usage</h3>
            <p>New users receive 3 free readings. Additional readings require a premium subscription.</p>
            
            <h3>3. Premium Subscription</h3>
            <p>Premium subscriptions provide unlimited access to our services. Subscriptions are managed through Shopify and are subject to their terms.</p>
            
            <h3>4. No Guarantee</h3>
            <p>Binary Fate provides guidance based on ancient metaphysical principles but does not guarantee accuracy or outcomes. Users should exercise their own judgment.</p>
            
            <h3>5. Changes to Terms</h3>
            <p>We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of the updated terms.</p>
            
            <button onClick={() => setActivePage('home')} style={{ marginTop: '2rem' }}>Back to Home</button>
          </section>
        )}
        
        {activePage === 'home' && (
          <>
            {!user && !showLogin && (
              <section>
                <h2>Welcome to Binary Fate</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Register with your email to get started with 3 free readings.
                </p>
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <button type="submit">Register</button>
                </form>
              </section>
            )}

            {user && (
              <div>
                <div className="usage-info">
                  <p>Welcome, {user.email}</p>
                  <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    Usage: {user.usageCount} / {user.isPremium ? 'Unlimited' : user.freeLimit}
                    {!user.isPremium && user.usageCount >= user.freeLimit && (
                      <button onClick={handleUpgrade} style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem' }}>
                        Upgrade Now
                      </button>
                    )}
                    <button onClick={handleLogout} style={{ padding: '0.5rem 1.2rem', fontSize: '1rem', backgroundColor: '#e94560', border: 'none', color: 'white', borderRadius: '6px' }}>
                      Change Account
                    </button>
                  </p>
                </div>

                <section>
                  <h2>Enter Your Birth Details</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="birthDate">Date of Birth</label>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="birthTime">Time of Birth (2-hour period)</label>
                      <select
                        id="birthTime"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select time period</option>
                        <option value="23:00">23:00-01:00 (Zi/Rat)</option>
                        <option value="01:00">01:00-03:00 (Chou/Ox)</option>
                        <option value="03:00">03:00-05:00 (Yin/Tiger)</option>
                        <option value="05:00">05:00-07:00 (Mao/Rabbit)</option>
                        <option value="07:00">07:00-09:00 (Chen/Dragon)</option>
                        <option value="09:00">09:00-11:00 (Si/Snake)</option>
                        <option value="11:00">11:00-13:00 (Wu/Horse)</option>
                        <option value="13:00">13:00-15:00 (Wei/Sheep)</option>
                        <option value="15:00">15:00-17:00 (Shen/Monkey)</option>
                        <option value="17:00">17:00-19:00 (You/Rooster)</option>
                        <option value="19:00">19:00-21:00 (Xu/Dog)</option>
                        <option value="21:00">21:00-23:00 (Hai/Pig)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="question">Question to Decide</label>
                      <textarea
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your question that requires a YES/NO answer"
                      ></textarea>
                    </div>

                    <div className="button-group">
                      <button type="submit" disabled={loading}>
                        {loading ? 'Analyzing...' : 'Get Binary Verdict'}
                      </button>
                      <button type="button" onClick={() => setResult(null)}>
                        New Reading
                      </button>
                    </div>
                  </form>
                  
                  {error && (
                    <p style={{ color: '#f44336', textAlign: 'center', marginTop: '1rem' }}>
                      {error}
                    </p>
                  )}
                </section>
              </div>
            )}

            {result && (
              <section>
                <div className="result-container">
                  <div className={`result ${result.result.toLowerCase().replace(/\s+/g, '-')}`}>
                    {result.result}
                  </div>
                  <div className="verse">
                    "{result.verse}"
                  </div>
                  <div className="teaser">
                    {result.teaser}
                  </div>
                </div>
              </section>
            )}

            <section>
              <h2>About Binary Fate</h2>
              <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                Binary Fate synthesizes ancient Chinese metaphysics with modern binary decision-making. 
                Our system combines Liang Xiangrun's techniques, Lu Zhiji's academic structure, 
                and the Blind School's decisive methods to provide clear YES/NO guidance.
              </p>
            </section>
          </>
        )}
      </main>

      <footer>
        <p>
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('privacy'); }}>Privacy Policy</a> | 
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('terms'); }}>Terms of Service</a> | 
          <a href="#">Contact</a>
        </p>
        <p>&copy; 2024 Binary Fate Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
