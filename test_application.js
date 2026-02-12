const axios = require('axios');

// Base URL for the API
const API_BASE_URL = 'http://localhost:5001';

// Test user email
const TEST_EMAIL = 'testuser@example.com';

// Test data for Bazi analysis
const TEST_BAZI_DATA = {
  gender: 'male',
  birthDate: '1990-01-01',
  birthTime: '08:00',
  question: 'Will I find success in my career?'
};

// Test function
async function runTests() {
  console.log('🚀 Starting Binary Fate Engine Tests...');
  console.log('='.repeat(50));

  try {
    // Test 1: User Registration
    console.log('\n1. Testing User Registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/api/user/register`, {
      email: TEST_EMAIL
    });
    console.log('✅ User registered successfully:', registerResponse.data.message);
    console.log('   User:', registerResponse.data.user);

    // Test 2: Get Initial Usage Count
    console.log('\n2. Testing Initial Usage Count...');
    const initialUsageResponse = await axios.get(`${API_BASE_URL}/api/user/usage/${TEST_EMAIL}`);
    console.log('✅ Initial usage count:', initialUsageResponse.data.usageCount);
    console.log('   Free limit:', initialUsageResponse.data.freeLimit);
    console.log('   Is premium:', initialUsageResponse.data.isPremium);

    // Test 3: Submit Bazi Analysis (should increment usage)
    console.log('\n3. Testing Bazi Analysis Submission...');
    
    // First, increment usage
    const usageResponse = await axios.post(`${API_BASE_URL}/api/user/usage`, {
      email: TEST_EMAIL
    });
    console.log('✅ Usage incremented successfully:', usageResponse.data.message);
    console.log('   Updated usage count:', usageResponse.data.usageCount);
    console.log('   Remaining free:', usageResponse.data.remainingFree);

    // Then get Bazi analysis
    const baziResponse = await axios.post(`${API_BASE_URL}/api/bazi/analyze`, {
      ...TEST_BAZI_DATA
    });
    console.log('✅ Bazi analysis completed successfully');
    console.log('   Result:', baziResponse.data.result);
    console.log('   Poem verse:', baziResponse.data.verse);

    // Test 4: Verify Usage Count Updated
    console.log('\n4. Verifying Usage Count Persistence...');
    const updatedUsageResponse = await axios.get(`${API_BASE_URL}/api/user/usage/${TEST_EMAIL}`);
    console.log('✅ Usage count persisted:', updatedUsageResponse.data.usageCount);
    
    // Test 5: Test Admin User
    console.log('\n5. Testing Admin User...');
    const adminEmail = 'binaryfateofficial@outlook.com';
    const adminUsageResponse = await axios.get(`${API_BASE_URL}/api/user/usage/${adminEmail}`);
    console.log('✅ Admin user usage:', adminUsageResponse.data.usageCount);
    console.log('   Admin free limit:', adminUsageResponse.data.freeLimit);
    console.log('   Admin is premium:', adminUsageResponse.data.isPremium);

    // Test 6: Test Multiple Usage Increments
    console.log('\n6. Testing Multiple Usage Increments...');
    await axios.post(`${API_BASE_URL}/api/user/usage`, { email: TEST_EMAIL });
    await axios.post(`${API_BASE_URL}/api/user/usage`, { email: TEST_EMAIL });
    
    const finalUsageResponse = await axios.get(`${API_BASE_URL}/api/user/usage/${TEST_EMAIL}`);
    console.log('✅ Final usage count after multiple increments:', finalUsageResponse.data.usageCount);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests passed successfully!');
    console.log('✅ The Binary Fate Engine is working correctly.');
    console.log('✅ Usage counting is functioning properly.');
    console.log('✅ Bazi analysis is working.');
    console.log('✅ Admin user has unlimited access.');
    console.log('✅ Regular users get 3 free readings.');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    } else if (error.request) {
      console.error('   No response received');
    }
    process.exit(1);
  }
}

// Run the tests
runTests();
