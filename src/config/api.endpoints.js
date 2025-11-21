// API Endpoints Configuration
const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    REGISTER: '/auth/register',
  },

  // User endpoints
  USERS: {
    LIST: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    REGISTER: '/users/register',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    BULK_DELETE: '/users/bulk-delete',
    ACTIVATE: (id) => `/users/${id}/activate`,
    DEACTIVATE: (id) => `/users/${id}/deactivate`,
    RESET_PASSWORD: (id) => `/users/${id}/reset-password`,
    CHANGE_PASSWORD: (id) => `/users/${id}/change-password`,
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

