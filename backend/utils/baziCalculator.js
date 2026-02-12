// Heavenly Stems (Tian Gan)
const HEAVENLY_STEMS = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];

// Earthly Branches (Di Zhi)
const EARTHLY_BRANCHES = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];

// Five Elements (Wu Xing)
const FIVE_ELEMENTS = {
  'Jia': 'Wood', 'Yi': 'Wood',
  'Bing': 'Fire', 'Ding': 'Fire',
  'Wu': 'Earth', 'Ji': 'Earth',
  'Geng': 'Metal', 'Xin': 'Metal',
  'Ren': 'Water', 'Gui': 'Water'
};

// Branch Elements
const BRANCH_ELEMENTS = {
  'Zi': 'Water', 'Chou': 'Earth', 'Yin': 'Wood', 'Mao': 'Wood',
  'Chen': 'Earth', 'Si': 'Fire', 'Wu': 'Fire', 'Wei': 'Earth',
  'Shen': 'Metal', 'You': 'Metal', 'Xu': 'Earth', 'Hai': 'Water'
};

// Branch藏干 (Hidden Stems)
const HIDDEN_STEMS = {
  'Zi': ['Gui'],
  'Chou': ['Ji', 'Geng', 'Xin'],
  'Yin': ['Jia', 'Bing', 'Wu'],
  'Mao': ['Yi'],
  'Chen': ['Ji', 'Ren', 'Gui'],
  'Si': ['Bing', 'Wu', 'Geng'],
  'Wu': ['Ding', 'Ji'],
  'Wei': ['Ji', 'Bing', 'Ding'],
  'Shen': ['Geng', 'Ren', 'Wu'],
  'You': ['Xin'],
  'Xu': ['Wu', 'Geng', 'Xin'],
  'Hai': ['Ren', 'Jia']
};

// Ten Heavenly Stems in order of production
const STEMS_ORDER = HEAVENLY_STEMS;

// Twelve Earthly Branches in order
const BRANCHES_ORDER = EARTHLY_BRANCHES;

// Calculate Heavenly Stem for a given year
function getYearStem(year) {
  return STEMS_ORDER[(year - 4) % 10];
}

// Calculate Earthly Branch for a given year
function getYearBranch(year) {
  return BRANCHES_ORDER[(year - 4) % 12];
}

// Calculate Heavenly Stem for a given month
function getMonthStem(yearStem, month) {
  const monthStemIndex = (STEMS_ORDER.indexOf(yearStem) * 2 + month - 1) % 10;
  return STEMS_ORDER[monthStemIndex];
}

// Calculate Earthly Branch for a given month
function getMonthBranch(month) {
  // 寅月 is month 1 (February in solar calendar)
  return BRANCHES_ORDER[(month + 1) % 12];
}

// Calculate Heavenly Stem for a given day
// This is a simplified version - actual calculation requires a complex algorithm
// For production, we would use a lunisolar calendar library
function getDayStem(year, month, day) {
  // Simplified calculation - in real app, use a proper lunisolar calendar
  const baseDate = new Date(1900, 0, 31); // 1900-01-31 is Jia-Zi day
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  return STEMS_ORDER[diffDays % 10];
}

// Calculate Earthly Branch for a given day
function getDayBranch(year, month, day) {
  const baseDate = new Date(1900, 0, 31); // 1900-01-31 is Jia-Zi day
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  return BRANCHES_ORDER[diffDays % 12];
}

// Calculate Heavenly Stem for a given hour
function getHourStem(dayStem, hour) {
  const hourStemIndex = (STEMS_ORDER.indexOf(dayStem) * 2 + Math.floor(hour / 2)) % 10;
  return STEMS_ORDER[hourStemIndex];
}

// Calculate Earthly Branch for a given hour
function getHourBranch(hour) {
  return BRANCHES_ORDER[Math.floor(hour / 2) % 12];
}

// Generate full Bazi chart
function generateBaziChart(gender, birthDate, birthTime) {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const hour = parseInt(birthTime.split(':')[0]);
  
  // Calculate Four Pillars
  const yearStem = getYearStem(year);
  const yearBranch = getYearBranch(year);
  
  const monthStem = getMonthStem(yearStem, month);
  const monthBranch = getMonthBranch(month);
  
  const dayStem = getDayStem(year, month, day);
  const dayBranch = getDayBranch(year, month, day);
  
  const hourStem = getHourStem(dayStem, hour);
  const hourBranch = getHourBranch(hour);
  
  return {
    gender,
    birthDate: `${month}-${day}-${year}`,
    birthTime,
    pillars: {
      year: { stem: yearStem, branch: yearBranch, element: FIVE_ELEMENTS[yearStem] },
      month: { stem: monthStem, branch: monthBranch, element: FIVE_ELEMENTS[monthStem] },
      day: { stem: dayStem, branch: dayBranch, element: FIVE_ELEMENTS[dayStem] },
      hour: { stem: hourStem, branch: hourBranch, element: FIVE_ELEMENTS[hourStem] }
    },
    dayMaster: { stem: dayStem, element: FIVE_ELEMENTS[dayStem] },
    hiddenStems: {
      year: HIDDEN_STEMS[yearBranch],
      month: HIDDEN_STEMS[monthBranch],
      day: HIDDEN_STEMS[dayBranch],
      hour: HIDDEN_STEMS[hourBranch]
    }
  };
}

module.exports = {
  generateBaziChart,
  getYearStem,
  getYearBranch,
  FIVE_ELEMENTS,
  BRANCH_ELEMENTS,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
};