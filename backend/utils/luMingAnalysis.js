const { HEAVENLY_STEMS, EARTHLY_BRANCHES } = require('./baziCalculator');

// Lu (Salary/Prosperity) mapping
// Lu is the branch that contains the same stem as the Day Master
const LU_MAPPING = {
  'Jia': 'Yin',
  'Yi': 'Mao',
  'Bing': 'Si',
  'Ding': 'Wu',
  'Wu': 'Chen',
  'Ji': 'Xu',
  'Geng': 'Shen',
  'Xin': 'You',
  'Ren': 'Hai',
  'Gui': 'Zi'
};

// Analyze Lu (Salary/Prosperity) status
function analyzeLuStatus(baziChart) {
  const dayMaster = baziChart.dayMaster.stem;
  const luBranch = LU_MAPPING[dayMaster];
  
  // Check if Lu is present in any pillar
  const pillars = baziChart.pillars;
  const luPositions = [];
  
  if (pillars.year.branch === luBranch) luPositions.push('year');
  if (pillars.month.branch === luBranch) luPositions.push('month');
  if (pillars.day.branch === luBranch) luPositions.push('day');
  if (pillars.hour.branch === luBranch) luPositions.push('hour');
  
  let luStatus = 'absent';
  let luStrength = 0;
  
  if (luPositions.length > 0) {
    luStatus = 'present';
    luStrength = luPositions.length;
    
    // Check if Lu is in favorable position
    if (luPositions.includes('month') || luPositions.includes('day')) {
      luStatus = 'strong';
    } else if (luPositions.includes('year') || luPositions.includes('hour')) {
      luStatus = 'weak';
    }
  }
  
  return {
    dayMaster,
    luBranch,
    luPositions,
    luStatus,
    luStrength
  };
}

module.exports = {
  analyzeLuStatus
};