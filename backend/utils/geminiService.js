const axios = require('axios');
require('dotenv').config();

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Format Bazi chart data for Gemini API
 * @param {Object} baziChart - Generated Bazi chart
 * @param {string} question - User's question
 * @returns {string} Formatted prompt for Gemini
 */
function formatBaziForGemini(baziChart, question) {
  const { pillars, dayMaster, gender } = baziChart;
  
  return `
    You are a professional Zi Ping Bazi (Four Pillars of Destiny) expert. Analyze the following Bazi chart and answer the user's YES/NO question.
    
    GENDER: ${gender}
    
    BAZI CHART:
    - Year Pillar: ${pillars.year.stem} ${pillars.year.branch} (${pillars.year.element})
    - Month Pillar: ${pillars.month.stem} ${pillars.month.branch} (${pillars.month.element})
    - Day Pillar: ${pillars.day.stem} ${pillars.day.branch} (${pillars.day.element})
    - Hour Pillar: ${pillars.hour.stem} ${pillars.hour.branch} (${pillars.hour.element})
    
    DAY MASTER: ${dayMaster.stem} (${dayMaster.element})
    
    USER QUESTION: ${question}
    
    Please provide:
    1. A binary verdict: YES, NO, or NOT NOW (only one word)
    2. A classic English poem verse that matches the verdict mood
    3. A 2-sentence teaser analysis that explains the verdict
    
    Format your response exactly as:
    VERDICT: [YES/NO/NOT NOW]
    VERSE: "[poem verse]"
    TEASER: [first sentence] [second sentence]
  `;
}

/**
 * Parse Gemini API response
 * @param {Object} response - Gemini API response
 * @returns {Object} Parsed result with verdict, verse, and teaser
 */
function parseGeminiResponse(response) {
  try {
    const content = response.data.candidates[0].content.parts[0].text;
    
    // Extract verdict, verse, and teaser using regex
    const verdictMatch = content.match(/VERDICT: (YES|NO|NOT NOW)/i);
    const verseMatch = content.match(/VERSE: "([^"]+)"/i);
    const teaserMatch = content.match(/TEASER: (.+)/i);
    
    if (!verdictMatch || !verseMatch || !teaserMatch) {
      throw new Error('Invalid Gemini response format');
    }
    
    return {
      verdict: verdictMatch[1].toUpperCase(),
      verse: verseMatch[1],
      teaser: teaserMatch[1]
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse Gemini response');
  }
}

/**
 * Analyze Bazi chart using Gemini API
 * @param {Object} baziChart - Generated Bazi chart
 * @param {string} question - User's question
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeBaziWithGemini(baziChart, question) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }
  
  try {
    const prompt = formatBaziForGemini(baziChart, question);
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return parseGeminiResponse(response);
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    throw new Error('Failed to call Gemini API');
  }
}

module.exports = {
  analyzeBaziWithGemini
};
