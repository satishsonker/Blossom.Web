// API Configuration
// Note: process.env.REACT_APP_API_BASE_URL is injected by webpack DefinePlugin at build time
// The DefinePlugin replaces process.env.REACT_APP_API_BASE_URL with the actual string value

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

export default API_CONFIG;

