const { FIVE_ELEMENTS, BRANCH_ELEMENTS } = require('./baziCalculator');

// Five Elements Relationships
const ELEMENT_RELATIONSHIPS = {
  'Wood': { generates: 'Fire', conquers: 'Earth', isGeneratedBy: 'Water', isConqueredBy: 'Metal' },
  'Fire': { generates: 'Earth', conquers: 'Metal', isGeneratedBy: 'Wood', isConqueredBy: 'Water' },
  'Earth': { generates: 'Metal', conquers: 'Water', isGeneratedBy: 'Fire', isConqueredBy: 'Wood' },
  'Metal': { generates: 'Water', conquers: 'Wood', isGeneratedBy: 'Earth', isConqueredBy: 'Fire' },
  'Water': { generates: 'Wood', conquers: 'Fire', isGeneratedBy: 'Metal', isConqueredBy: 'Earth' }
};

// Analyze Five Elements balance
function analyzeElementsBalance(baziChart) {
  const elements = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };
  
  // Count elements from stems
  const { year, month, day, hour } = baziChart.pillars;
  elements[FIVE_ELEMENTS[year.stem]] += 1;
  elements[FIVE_ELEMENTS[month.stem]] += 1;
  elements[FIVE_ELEMENTS[day.stem]] += 1;
  elements[FIVE_ELEMENTS[hour.stem]] += 1;
  
  // Count elements from branches
  elements[BRANCH_ELEMENTS[year.branch]] += 0.5;
  elements[BRANCH_ELEMENTS[month.branch]] += 0.5;
  elements[BRANCH_ELEMENTS[day.branch]] += 0.5;
  elements[BRANCH_ELEMENTS[hour.branch]] += 0.5;
  
  return elements;
}

// Analyze Day Master strength
function analyzeDayMasterStrength(baziChart) {
  const dayMaster = baziChart.dayMaster;
  const elements = analyzeElementsBalance(baziChart);
  
  // Calculate strength based on month branch
  const monthBranchElement = BRANCH_ELEMENTS[baziChart.pillars.month.branch];
  let strength = 0;
  
  // Check if month branch is same element as day master (wang - prosperous)
  if (monthBranchElement === dayMaster.element) {
    strength += 3;
  }
  
  // Check if month branch generates day master element (xiang - thriving)
  if (ELEMENT_RELATIONSHIPS[monthBranchElement].generates === dayMaster.element) {
    strength += 2;
  }
  
  // Check if day master element is same as other stems/branches
  const sameElementStems = Object.values(baziChart.pillars).filter(pillar => 
    FIVE_ELEMENTS[pillar.stem] === dayMaster.element
  ).length;
  
  strength += sameElementStems * 0.5;
  
  // Determine strength category
  let strengthCategory = 'average';
  if (strength >= 4) strengthCategory = 'strong';
  if (strength <= 2) strengthCategory = 'weak';
  
  return {
    strength,
    strengthCategory,
    elements
  };
}

// Analyze Structure (Geju)
function analyzeStructure(baziChart) {
  const dayMasterStrength = analyzeDayMasterStrength(baziChart);
  const dayMasterElement = baziChart.dayMaster.element;
  const elements = dayMasterStrength.elements;
  
  // Identify the strongest element (excluding day master element)
  let strongestElement = null;
  let maxStrength = 0;
  
  Object.entries(elements).forEach(([element, strength]) => {
    if (element !== dayMasterElement && strength > maxStrength) {
      maxStrength = strength;
      strongestElement = element;
    }
  });
  
  let structure = 'Unknown';
  
  if (strongestElement) {
    if (ELEMENT_RELATIONSHIPS[strongestElement].generates === dayMasterElement) {
      structure = 'Born from ' + strongestElement;
    } else if (ELEMENT_RELATIONSHIPS[dayMasterElement].generates === strongestElement) {
      structure = 'Generating ' + strongestElement;
    } else if (ELEMENT_RELATIONSHIPS[strongestElement].conquers === dayMasterElement) {
      structure = 'Controlled by ' + strongestElement;
    } else if (ELEMENT_RELATIONSHIPS[dayMasterElement].conquers === strongestElement) {
      structure = 'Controlling ' + strongestElement;
    }
  }
  
  return {
    structure,
    strongestElement,
    dayMasterStrength
  };
}

module.exports = {
  analyzeElementsBalance,
  analyzeDayMasterStrength,
  analyzeStructure,
  ELEMENT_RELATIONSHIPS
};