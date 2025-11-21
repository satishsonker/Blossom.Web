// Application Messages Configuration
const MESSAGES = {
  // Success Messages
  SUCCESS: {
    CREATE: 'Record created successfully',
    UPDATE: 'Record updated successfully',
    DELETE: 'Record deleted successfully',
    UPLOAD: 'File uploaded successfully',
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    OPERATION_SUCCESS: 'Operation completed successfully',
  },

  // Error Messages
  ERROR: {
    GENERIC: 'An error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    TIMEOUT: 'Request timeout. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access forbidden.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Validation error. Please check your input.',
    CREATE_FAILED: 'Failed to create record.',
    UPDATE_FAILED: 'Failed to update record.',
    DELETE_FAILED: 'Failed to delete record.',
    UPLOAD_FAILED: 'File upload failed.',
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
  },

  // Warning Messages
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes.',
    CONFIRM_DELETE: 'Are you sure you want to delete this record?',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    INVALID_DATA: 'Invalid data provided.',
  },

  // Info Messages
  INFO: {
    LOADING: 'Loading...',
    PROCESSING: 'Processing your request...',
    SAVING: 'Saving changes...',
    DELETING: 'Deleting record...',
    UPLOADING: 'Uploading file...',
  },

  // HTTP Status Code Messages
  STATUS_MESSAGES: {
    200: 'Operation completed successfully',
    201: 'Record created successfully',
    204: 'Record deleted successfully',
    400: 'Bad request. Please check your input.',
    401: 'Unauthorized. Please login again.',
    403: 'Access forbidden.',
    404: 'Resource not found.',
    409: 'Conflict. The resource already exists.',
    422: 'Validation error. Please check your input.',
    500: 'Server error. Please try again later.',
    502: 'Bad gateway. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  },
};

export default MESSAGES;

