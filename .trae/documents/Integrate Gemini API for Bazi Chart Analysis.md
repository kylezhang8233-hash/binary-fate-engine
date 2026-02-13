## Integration Plan

### 1. **Create Gemini API Utility**
- Create `backend/utils/geminiService.js` to handle API communication
- Implement functions to:
  - Format Bazi chart data for Gemini
  - Send analysis requests to Gemini API
  - Parse and validate Gemini responses
  - Handle API errors gracefully

### 2. **Update Environment Configuration**
- Create `backend/.env` file for API key management
- Add `GEMINI_API_KEY` and `GEMINI_API_URL` environment variables
- Ensure .env is added to .gitignore for security

### 3. **Modify Bazi Analysis Route**
- Update `backend/routes/bazi.js` to use Gemini API instead of current local analysis
- Keep existing Bazi chart generation (only replace the analysis logic)
- Send formatted Bazi chart + user question to Gemini
- Parse Gemini response to get binary verdict, poem verse, and teaser

### 4. **Format Data for Gemini**
- Structure Bazi chart data in a human-readable format
- Include:
  - Four Pillars (year, month, day, hour) with stems/branches/elements
  - Day Master information
  - Current year energy
  - User's question
- Provide clear instructions for Gemini to return:
  - Binary verdict (YES/NO/NOT NOW)
  - Classic English poem verse
  - 2-sentence teaser analysis

### 5. **Implement Fallback Mechanism**
- Add fallback to existing local analysis if Gemini API fails
- Ensure the system remains operational even with API issues
- Log API errors for monitoring

### 6. **Test Integration**
- Test with various Bazi charts and questions
- Verify consistent results between Gemini and local analysis
- Ensure proper error handling

### 7. **Update Documentation**
- Add comments explaining Gemini API integration
- Document environment variables
- Update README with integration details

### Expected Outcome
- Improved Bazi analysis using Gemini's advanced AI capabilities
- Maintained backward compatibility
- Enhanced user experience with more insightful analysis
- Scalable architecture for future improvements