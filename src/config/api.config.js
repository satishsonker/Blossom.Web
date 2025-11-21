// API Configuration
const API_CONFIG = {
  BASE_URL: (typeof process !== 'undefined' && process.env && process.env.RACT_APP_BLOSSOM_API_BASE_PATH) 
    ? process.env.RACT_APP_BLOSSOM_API_BASE_PATH 
    : 'https://api.example.com/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

export default API_CONFIG;

