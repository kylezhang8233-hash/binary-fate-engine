import React, { useState } from 'react';
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
  const [activePage, setActivePage] = useState('home'); // home, privacy, terms

  // API Base URL
  const API_BASE_URL = 'https://binary-fate-backend.onrender.com';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Get Bazi analysis directly without user registration
      const baziResponse = await axios.post(`${API_BASE_URL}/api/bazi/analyze`, formData);
      setResult(baziResponse.data);
      
    } catch (err) {
      console.error('Bazi analysis error:', err);
      setError(err.response?.data?.error || 'Failed to get Bazi analysis');
    } finally {
      setLoading(false);
    }
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
            <p>We collect personal information that you voluntarily provide when using our services, such as your birth details and question.</p>
            
            <h3>2. How We Use Your Information</h3>
            <p>We use your information to provide and improve our Bazi analysis services.</p>
            
            <h3>3. Information Sharing</h3>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
            
            <h3>4. Data Security</h3>
            <p>We implement appropriate security measures to protect your personal information.</p>
            
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
            <p>Our services are available for free use.</p>
            
            <h3>3. No Guarantee</h3>
            <p>Binary Fate provides guidance based on ancient metaphysical principles but does not guarantee accuracy or outcomes. Users should exercise their own judgment.</p>
            
            <h3>4. Changes to Terms</h3>
            <p>We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of the updated terms.</p>
            
            <button onClick={() => setActivePage('home')} style={{ marginTop: '2rem' }}>Back to Home</button>
          </section>
        )}
        
        {activePage === 'home' && (
          <>
            {/* Birth Details Form - Direct Access */}
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
