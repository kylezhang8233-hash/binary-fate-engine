const express = require('express');
const router = express.Router();
const { generateBaziChart } = require('../utils/baziCalculator');
const { determineBinaryVerdict, getPoemVerse } = require('../utils/binaryVerdict');
const { analyzeLuStatus } = require('../utils/luMingAnalysis');
const { analyzeStructure } = require('../utils/ziPingAnalysis');
const { analyzeBaziWithGemini } = require('../utils/geminiService');

// POST route for Bazi analysis
router.post('/analyze', async (req, res) => {
  try {
    const { gender, birthDate, birthTime, question } = req.body;
    
    // Validate input
    if (!gender || !birthDate || !birthTime || !question) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Generate Bazi chart
    const baziChart = generateBaziChart(gender, birthDate, birthTime);
    
    let result, verse, teaser, analysisMethod;
    
    try {
      // Try to use Gemini API for analysis
      const geminiResult = await analyzeBaziWithGemini(baziChart, question);
      result = geminiResult.verdict;
      verse = geminiResult.verse;
      teaser = geminiResult.teaser;
      analysisMethod = 'gemini';
      console.log('Using Gemini API for analysis');
    } catch (geminiError) {
      // Fallback to local analysis if Gemini fails
      console.error('Gemini API failed, falling back to local analysis:', geminiError.message);
      
      // Determine binary verdict using local logic
      const verdictResult = determineBinaryVerdict(baziChart, question);
      result = verdictResult.verdict || 'NOT NOW';
      
      // Get poem verse
      verse = getPoemVerse(result, baziChart);
      
      // Create teaser
      teaser = generateTeaser(baziChart, { verdict: result });
      analysisMethod = 'local';
      console.log('Local analysis result:', result, 'Verse:', verse);
    }
    
    res.json({
      result,
      verse,
      teaser,
      chart: baziChart,
      analysis: {
        luStatus: analyzeLuStatus(baziChart),
        structure: analyzeStructure(baziChart),
        method: analysisMethod
      }
    });
  } catch (error) {
    console.error('Error analyzing Bazi:', error);
    res.status(500).json({ error: 'Failed to analyze Bazi chart' });
  }
});

// Helper function to generate teaser
function generateTeaser(baziChart, verdictResult) {
  const dayMaster = baziChart.dayMaster.stem;
  const dayMasterElement = baziChart.dayMaster.element;
  const currentYear = new Date().getFullYear();
  
  let teaser1, teaser2;
  
  if (verdictResult.verdict === 'YES') {
    teaser1 = `The ${dayMaster} ${dayMasterElement} energy flows freely this year, opening pathways aligned with your cosmic blueprint.`;
    teaser2 = `Your chart reveals a harmonious resonance between your destiny and the ${currentYear} celestial currents.`;
  } else if (verdictResult.verdict === 'NO') {
    teaser1 = `The ${dayMaster} ${dayMasterElement} energy encounters resistance this year, signaling obstacles in your queried path.`;
    teaser2 = `Celestial forces suggest pausing and realigning before proceeding with your current course.`;
  } else {
    teaser1 = `The ${dayMaster} ${dayMasterElement} energy exists in a state of flux this year, neither fully open nor blocked.`;
    teaser2 = `This is a time of preparation and waiting for the cosmic tides to shift in your favor.`;
  }
  
  return `${teaser1} ${teaser2}`;
}

module.exports = router;