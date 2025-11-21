# API Service Documentation

## Overview

The API service provides a centralized way to make HTTP requests with automatic loading indicators, toast notifications, error handling, and more.

## Features

- ✅ GET, POST, PUT, PATCH, DELETE methods
- ✅ File upload (single and multiple)
- ✅ Multiple API calls support
- ✅ Automatic loading indicator
- ✅ Automatic toast notifications (success/error/warning)
- ✅ Error handling with status code messages
- ✅ Request timeout handling
- ✅ Authentication token support
- ✅ Customizable options

## Configuration

### API Base URL

Edit `src/config/api.config.js` to set your API base URL:

```javascript
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com/api/v1',
  TIMEOUT: 30000, // 30 seconds
};
```

### API Endpoints

Define your endpoints in `src/config/api.endpoints.js`:

```javascript
const API_ENDPOINTS = {
  USERS: {
    LIST: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
};
```

### Messages

Customize messages in `src/config/messages.js`:

```javascript
const MESSAGES = {
  SUCCESS: {
    CREATE: 'Record created successfully',
    UPDATE: 'Record updated successfully',
    // ...
  },
  ERROR: {
    GENERIC: 'An error occurred. Please try again.',
    // ...
  },
};
```

## Usage

### Basic GET Request

```javascript
import apiService from '../services/api.service';
import API_ENDPOINTS from '../config/api.endpoints';

const fetchUsers = async () => {
  try {
    const response = await apiService.get(API_ENDPOINTS.USERS.LIST);
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
};
```

### POST Request (Create)

```javascript
const createUser = async (userData) => {
  try {
    const response = await apiService.post(
      API_ENDPOINTS.USERS.CREATE,
      userData
    );
    // Success toast automatically shown
    return response.data;
  } catch (error) {
    // Error toast automatically shown
    throw error;
  }
};
```

### PUT Request (Update)

```javascript
const updateUser = async (userId, userData) => {
  try {
    const response = await apiService.put(
      API_ENDPOINTS.USERS.UPDATE(userId),
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

### DELETE Request

```javascript
const deleteUser = async (userId) => {
  try {
    const response = await apiService.delete(
      API_ENDPOINTS.USERS.DELETE(userId)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

### File Upload (Single)

```javascript
const uploadFile = async (file) => {
  try {
    const response = await apiService.uploadFile(
      API_ENDPOINTS.UPLOAD.SINGLE,
      file,
      {
        fieldName: 'file',
        additionalData: {
          description: 'User document',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

### Multiple File Upload

```javascript
const uploadMultipleFiles = async (files) => {
  try {
    const response = await apiService.uploadMultipleFiles(
      API_ENDPOINTS.UPLOAD.MULTIPLE,
      files,
      {
        fieldName: 'files',
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

### Multiple API Calls

```javascript
const fetchMultipleData = async () => {
  try {
    const requests = [
      { url: API_ENDPOINTS.USERS.LIST, method: 'GET' },
      { url: API_ENDPOINTS.PRODUCTS.LIST, method: 'GET' },
    ];

    const result = await apiService.multiple(requests);
    
    if (result.allSucceeded) {
      console.log('All requests succeeded');
    } else {
      console.log('Some requests failed:', result.errors);
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};
```

## Options

All API methods accept an optional `options` parameter:

```javascript
{
  showLoading: true,        // Show loading indicator (default: true)
  showToast: true,          // Show toast notifications (default: true)
  timeout: 30000,           // Request timeout in ms (default: 30000)
  headers: {},              // Custom headers
  customSuccessMessage: '', // Custom success message
}
```

### Disable Loading/Toast

```javascript
// Silent request (no loading, no toast)
const response = await apiService.get(API_ENDPOINTS.USERS.LIST, {
  showLoading: false,
  showToast: false,
});
```

### Custom Headers

```javascript
const response = await apiService.get(API_ENDPOINTS.USERS.LIST, {
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## Automatic Features

### Loading Indicator

- Automatically shows when API call starts
- Automatically hides when API call completes
- For multiple API calls, shows until all complete
- Integrated via `LoadingProvider` component

### Toast Notifications

- **Success**: Automatically shown on successful POST, PUT, DELETE, and file upload
- **Error**: Automatically shown on any error
- **Warning**: Can be triggered manually
- Shows animated icons (success checkmark, error cross, warning triangle)
- Displays multiple error messages if available
- Auto-dismisses after 5 seconds (configurable)

### Error Handling

- Automatically maps HTTP status codes to messages
- Extracts error messages from response
- Shows multiple error details if available
- Handles network errors
- Handles timeout errors

## Response Format

All API methods return:

```javascript
{
  data: any,           // Response data
  status: number,      // HTTP status code
  headers: Headers,    // Response headers
}
```

## Error Format

Errors are thrown as:

```javascript
{
  status: number,      // HTTP status code (0 for network errors)
  message: string,     // Error message
  details: string[],   // Additional error details
  data: any,          // Error response data
}
```

## Authentication

The API service automatically includes the authentication token from localStorage:

```javascript
// Token is automatically added to headers
const token = localStorage.getItem('authToken');
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

## Toast Component

The toast component is automatically integrated and shows:

- **Success**: Green checkmark animation
- **Error**: Red cross animation  
- **Warning**: Yellow triangle animation

Toasts are centered on screen and can display:
- Main message
- Multiple detail messages (for errors)

## Loading Component

The loading component shows:
- Animated spinner
- Loading message
- Overlay backdrop

Automatically managed by the API service - no manual control needed.

## Examples

See `src/examples/api.usage.example.js` for comprehensive usage examples.

