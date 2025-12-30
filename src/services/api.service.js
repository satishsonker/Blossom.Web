import API_CONFIG from '../config/api.config';
import MESSAGES from '../config/messages';

 
// Global loading state management
let activeRequests = 0;
let loadingCallbacks = [];

// Add loading callback
export const addLoadingCallback = (callback) => {
  loadingCallbacks.push(callback);
};

// Remove loading callback
export const removeLoadingCallback = (callback) => {
  loadingCallbacks = loadingCallbacks.filter(cb => cb !== callback);
};

// Update loading state
const updateLoadingState = (isLoading) => {
  loadingCallbacks.forEach(callback => callback(isLoading));
};

// Show loading
const showLoading = () => {
  activeRequests++;
  if (activeRequests === 1) {
    updateLoadingState(true);
  }
};

// Hide loading
const hideLoading = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    updateLoadingState(false);
  }
};

// Global toast callback
let toastCallback = null;

// Set toast callback
export const setToastCallback = (callback) => {
  toastCallback = callback;
};

// Show toast
const showToast = (type, message, details = []) => {
  if (toastCallback) {
    toastCallback({ type, message, details });
  }
};

// Global logout callback
let logoutCallback = null;

// Set logout callback
export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

// Get default headers
const getHeaders = (customHeaders = {}, includeContentType = true) => {
  const headers = {
    ...customHeaders
  };

  if (includeContentType && !headers['Content-Type'] && !(customHeaders instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Add auth token if available
  try {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      const token = parsedToken?.token || parsedToken;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    // If token parsing fails, try to use it as a string
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Handle response
const handleResponse = async (response, showToastOnSuccess = true, customSuccessMessage = null, shouldShowToast = true) => {
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || MESSAGES.STATUS_MESSAGES[response.status] || MESSAGES.ERROR.GENERIC;
    const errorDetails = data?.errors || (data?.message ? [data.message] : []);

    // Handle 401 Unauthorized - always show toast (critical error)
    if (response.status === 401) {
      const unauthorizedMessage = data?.message || data?.error || 'Your session has expired. Please login again.';
      showToast('error', unauthorizedMessage, errorDetails);
      
      // Call logout callback if available
      if (logoutCallback) {
        logoutCallback();
      }
      
      // Redirect to home page with a flag to show login popup
      setTimeout(() => {
        window.location.href = '/?sessionExpired=true';
      }, 1500); // Small delay to show the toast message
    } else if (shouldShowToast) {
      // Only show error toast if shouldShowToast is true (not for GET requests)
      showToast('error', errorMessage, errorDetails);
    }
    
    throw {
      status: response.status,
      message: errorMessage,
      details: errorDetails,
      data: data,
    };
  }

  // Show success toast only for POST, PUT, DELETE and only if shouldShowToast is true
  if (shouldShowToast && showToastOnSuccess && (response.status === 201 || response.status === 200 || response.status === 204)) {
    const method = response.config?.method?.toUpperCase();
    // Don't show success toast for GET requests
    if (method === 'GET') {
      return data;
    }
    
    let message = customSuccessMessage;

    if (!message) {
      if (method === 'POST' || response.status === 201) {
        message = MESSAGES.SUCCESS.CREATE;
      } else if (method === 'PUT' || method === 'PATCH') {
        message = MESSAGES.SUCCESS.UPDATE;
      } else if (method === 'DELETE' || response.status === 204) {
        message = MESSAGES.SUCCESS.DELETE;
      } else {
        message = MESSAGES.SUCCESS.OPERATION_SUCCESS;
      }
    }

    showToast('success', message);
  }

  return data;
};

// Make API request
const makeRequest = async (url, options = {}, showToastOnSuccess = true, customSuccessMessage = null) => {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    showLoading: shouldShowLoading = true,
    showToast: shouldShowToast = true,
    timeout = API_CONFIG.TIMEOUT,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    if (shouldShowLoading) {
      showLoading();
    }

    const config = {
      method,
      headers: getHeaders(customHeaders, !(body instanceof FormData)),
      signal: controller.signal,
    };

    if (body && !(body instanceof FormData)) {
      config.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      config.body = body;
    }
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, config);
    clearTimeout(timeoutId);

    // Store method in response for handleResponse
    response.config = { method };

    const data = await handleResponse(response, showToastOnSuccess, customSuccessMessage, shouldShowToast);

    if (shouldShowLoading) {
      hideLoading();
    }

    return { data, status: response.status, headers: response.headers };
  } catch (error) {
    clearTimeout(timeoutId);

    if (shouldShowLoading) {
      hideLoading();
    }

    if (error.name === 'AbortError') {
      const timeoutMessage = MESSAGES.ERROR.TIMEOUT;
      if (shouldShowToast) {
        showToast('error', timeoutMessage);
      }
      throw { status: 408, message: timeoutMessage, details: [] };
    }

    if (error.status) {
      // Already handled in handleResponse
      throw error;
    }

    // Network error
    const networkMessage = MESSAGES.ERROR.NETWORK;
    if (shouldShowToast) {
      showToast('error', networkMessage);
    }
    throw { status: 0, message: networkMessage, details: [] };
  }
};

// API Service
const apiService = {
  // GET request - no toasts by default
  get: async (url, options = {}) => {
    return makeRequest(url, { ...options, method: 'GET', showToast: false }, false);
  },

  // POST request
  post: async (url, body, options = {}) => {
    return makeRequest(url, { ...options, method: 'POST', body }, true);
  },

  // PUT request
  put: async (url, body, options = {}) => {
    return makeRequest(url, { ...options, method: 'PUT', body }, true);
  },

  // PATCH request
  patch: async (url, body, options = {}) => {
    return makeRequest(url, { ...options, method: 'PATCH', body }, true);
  },

  // DELETE request
  delete: async (url, options = {}) => {
    return makeRequest(url, { ...options, method: 'DELETE' }, true);
  },

  // File Upload
  uploadFile: async (url, file, options = {}) => {
    const {
      fieldName = 'file',
      additionalData = {},
      showToastOnSuccess = true,
      customSuccessMessage = MESSAGES.SUCCESS.UPLOAD,
    } = options;

    const formData = new FormData();
    formData.append(fieldName, file);

    // Append additional data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return makeRequest(url, {
      ...options,
      method: 'POST',
      body: formData,
      showLoading: options.showLoading !== false,
      showToast: options.showToast !== false,
    }, showToastOnSuccess, customSuccessMessage);
  },

  // Multiple File Upload
  uploadMultipleFiles: async (url, files, options = {}) => {
    const {
      fieldName = 'files',
      additionalData = {},
      showToastOnSuccess = true,
      customSuccessMessage = MESSAGES.SUCCESS.UPLOAD,
    } = options;

    const formData = new FormData();

    // Append multiple files
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append(fieldName, file);
      });
    } else {
      formData.append(fieldName, files);
    }

    // Append additional data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return makeRequest(url, {
      ...options,
      method: 'POST',
      body: formData,
      showLoading: options.showLoading !== false,
      showToast: options.showToast !== false,
    }, showToastOnSuccess, customSuccessMessage);
  },

  // Multiple API Calls
  multiple: async (requests, options = {}) => {
    const {
      showLoading: shouldShowLoading = true,
      showToast: shouldShowToast = true,
      stopOnFirstError = false,
    } = options;

    if (shouldShowLoading) {
      showLoading();
    }

    try {
      const results = await Promise.allSettled(
        requests.map(request => {
          const { url, method = 'GET', body, headers } = request;
          return makeRequest(
            url,
            { method, body, headers, showLoading: false, showToast: false },
            false
          );
        })
      );

      if (shouldShowLoading) {
        hideLoading();
      }

      const successes = [];
      const errors = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successes.push({ index, data: result.value });
        } else {
          errors.push({ index, error: result.reason });
        }
      });

      // Show toast for errors if any
      if (shouldShowToast && errors.length > 0) {
        const errorMessages = errors.map(e => e.error?.message || MESSAGES.ERROR.GENERIC);
        showToast('error', `Failed to complete ${errors.length} request(s)`, errorMessages);
      }

      // Show toast for all success if no errors
      if (shouldShowToast && errors.length === 0 && successes.length > 0) {
        showToast('success', MESSAGES.SUCCESS.OPERATION_SUCCESS);
      }

      return {
        successes,
        errors,
        allSucceeded: errors.length === 0,
        allFailed: successes.length === 0,
      };
    } catch (error) {
      if (shouldShowLoading) {
        hideLoading();
      }
      throw error;
    }
  },
};

export default apiService;

