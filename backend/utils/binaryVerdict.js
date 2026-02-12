const { getYearStem, getYearBranch, FIVE_ELEMENTS, BRANCH_ELEMENTS } = require('./baziCalculator');
const { analyzeDayMasterStrength, analyzeStructure, ELEMENT_RELATIONSHIPS } = require('./ziPingAnalysis');
const { analyzeLuStatus } = require('./luMingAnalysis');

// Get current year's energy
function getCurrentYearEnergy() {
  const currentYear = new Date().getFullYear();
  return {
    year: currentYear,
    stem: getYearStem(currentYear),
    branch: getYearBranch(currentYear),
    stemElement: FIVE_ELEMENTS[getYearStem(currentYear)],
    branchElement: BRANCH_ELEMENTS[getYearBranch(currentYear)]
  };
}

// Determine binary verdict
function determineBinaryVerdict(baziChart, question) {
  const currentYearEnergy = getCurrentYearEnergy();
  const dayMasterStrength = analyzeDayMasterStrength(baziChart);
  const structure = analyzeStructure(baziChart);
  const luStatus = analyzeLuStatus(baziChart);
  
  // Calculate compatibility between current year and day master
  const dayMasterElement = baziChart.dayMaster.element;
  const yearStemElement = currentYearEnergy.stemElement;
  const yearBranchElement = currentYearEnergy.branchElement;
  
  // Check relationships
  let compatibilityScore = 0;
  
  // Stem relationship
  if (yearStemElement === dayMasterElement) {
    compatibilityScore += 2;
  } else if (ELEMENT_RELATIONSHIPS[yearStemElement].generates === dayMasterElement) {
    compatibilityScore += 1;
  } else if (ELEMENT_RELATIONSHIPS[yearStemElement].conquers === dayMasterElement) {
    compatibilityScore -= 1;
  }
  
  // Branch relationship
  if (yearBranchElement === dayMasterElement) {
    compatibilityScore += 2;
  } else if (ELEMENT_RELATIONSHIPS[yearBranchElement].generates === dayMasterElement) {
    compatibilityScore += 1;
  } else if (ELEMENT_RELATIONSHIPS[yearBranchElement].conquers === dayMasterElement) {
    compatibilityScore -= 1;
  }
  
  // Add Lu status bonus
  if (luStatus.luStatus === 'strong') {
    compatibilityScore += 2;
  } else if (luStatus.luStatus === 'present') {
    compatibilityScore += 1;
  }
  
  // Add Day Master strength bonus
  if (dayMasterStrength.strengthCategory === 'strong' && compatibilityScore > 0) {
    compatibilityScore += 1;
  } else if (dayMasterStrength.strengthCategory === 'weak' && compatibilityScore < 0) {
    compatibilityScore -= 1;
  }
  
  // Determine verdict based on compatibility score
  let verdict = 'NOT NOW';
  if (compatibilityScore >= 3) {
    verdict = 'YES';
  } else if (compatibilityScore <= -2) {
    verdict = 'NO';
  }
  
  return {
    verdict,
    currentYearEnergy,
    compatibilityScore,
    analysis: {
      dayMasterStrength: dayMasterStrength.strengthCategory,
      luStatus: luStatus.luStatus,
      structure: structure.structure
    }
  };
}

// Generate a classic English poem verse based on the chart's Qi
function getPoemVerse(verdict, baziChart) {
  const verses = {
    YES: [
      "Two roads diverged in a wood, and I— I took the one less traveled by, And that has made all the difference.",
      "Hope springs eternal in the human breast: Man never is, but always to be blest.",
      "I am the master of my fate: I am the captain of my soul."
    ],
    NO: [
      "Turn, turn, turn. To everything there is a season, and a time to every purpose under the heaven.",
      "The best-laid schemes o' mice an' men Gang aft agley."
    ],
    'NOT NOW': [
      "To be, or not to be: that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune.",
      "All the world's a stage, And all the men and women merely players; They have their exits and their entrances."
    ]
  };
  
  const possibleVerses = verses[verdict] || verses['NOT NOW'];
  return possibleVerses[Math.floor(Math.random() * possibleVerses.length)];
}

module.exports = {
  determineBinaryVerdict,
  getPoemVerse,
  getCurrentYearEnergy
};