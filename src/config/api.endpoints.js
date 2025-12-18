// API Endpoints Configuration
const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/users/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    REGISTER: '/auth/register',
    GOOGLE_LOGIN: '/auth/google',
    FORGOT_PASSWORD: '/users/forgotPassword',
    RESET_PASSWORD: '/users/resetPassword',
    CHANGE_PASSWORD: '/users/changePassword',
  },

  // User endpoints
  USERS: {
    LIST: '/users/GetAll',
    GET_BY_ID: (id) => `/users/${id}`,
    REGISTER: '/users/register',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/delete/${id}`,
    BULK_DELETE: '/users/bulk-delete',
    ACTIVATE: (userId,active) => `/users/${userId}/activate/${active}`,
    VERIFY_EMAIL: (userId) => `/users/${userId}/verify/email`,
    RESET_PASSWORD: (id) => `/users/resetPassword`,
    CHANGE_PASSWORD: (id) => `/users/changePassword`,
  },

  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    GET_BY_ID: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    BULK_DELETE: '/products/bulk-delete',
  },

  // File upload endpoints
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
    AVATAR: '/upload/avatar',
    DOCUMENT: '/upload/document',
  },

  // Settings endpoints
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  },
};

export default API_ENDPOINTS;

