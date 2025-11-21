/**
 * API Service Usage Examples
 * 
 * This file demonstrates how to use the API service in your components
 */

import apiService from '../services/api.service';
import API_ENDPOINTS from '../config/api.endpoints';

// ============================================
// Example 1: GET Request
// ============================================
export const getUsersExample = async () => {
  try {
    const response = await apiService.get(API_ENDPOINTS.USERS.LIST);
    console.log('Users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// GET with options (disable loading/toast)
export const getUsersSilentExample = async () => {
  try {
    const response = await apiService.get(API_ENDPOINTS.USERS.LIST, {
      showLoading: false,
      showToast: false,
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// ============================================
// Example 2: POST Request (Create)
// ============================================
export const createUserExample = async (userData) => {
  try {
    const response = await apiService.post(
      API_ENDPOINTS.USERS.CREATE,
      userData
    );
    // Toast will automatically show success message
    return response.data;
  } catch (error) {
    // Toast will automatically show error message
    console.error('Error creating user:', error);
    throw error;
  }
};

// POST with custom success message
export const createUserCustomMessageExample = async (userData) => {
  try {
    const response = await apiService.post(
      API_ENDPOINTS.USERS.CREATE,
      userData,
      {
        customSuccessMessage: 'User account created successfully!',
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// Example 3: PUT Request (Update)
// ============================================
export const updateUserExample = async (userId, userData) => {
  try {
    const response = await apiService.put(
      API_ENDPOINTS.USERS.UPDATE(userId),
      userData
    );
    // Toast will automatically show "Record updated successfully"
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// Example 4: DELETE Request
// ============================================
export const deleteUserExample = async (userId) => {
  try {
    const response = await apiService.delete(
      API_ENDPOINTS.USERS.DELETE(userId)
    );
    // Toast will automatically show "Record deleted successfully"
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// Example 5: File Upload (Single)
// ============================================
export const uploadFileExample = async (file) => {
  try {
    const response = await apiService.uploadFile(
      API_ENDPOINTS.UPLOAD.SINGLE,
      file,
      {
        fieldName: 'file',
        additionalData: {
          description: 'User avatar',
          category: 'avatar',
        },
      }
    );
    // Toast will automatically show "File uploaded successfully"
    return response.data;
  } catch (error) {
    throw error;
  }
};

// File upload with custom options
export const uploadAvatarExample = async (file, userId) => {
  try {
    const response = await apiService.uploadFile(
      API_ENDPOINTS.UPLOAD.AVATAR,
      file,
      {
        fieldName: 'avatar',
        additionalData: {
          userId: userId,
        },
        customSuccessMessage: 'Avatar uploaded successfully!',
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// Example 6: Multiple File Upload
// ============================================
export const uploadMultipleFilesExample = async (files) => {
  try {
    const response = await apiService.uploadMultipleFiles(
      API_ENDPOINTS.UPLOAD.MULTIPLE,
      files,
      {
        fieldName: 'files',
        additionalData: {
          folder: 'documents',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// Example 7: Multiple API Calls
// ============================================
export const multipleApiCallsExample = async () => {
  try {
    const requests = [
      { url: API_ENDPOINTS.USERS.LIST, method: 'GET' },
      { url: API_ENDPOINTS.PRODUCTS.LIST, method: 'GET' },
      { url: API_ENDPOINTS.SETTINGS.GET, method: 'GET' },
    ];

    const result = await apiService.multiple(requests, {
      showLoading: true,
      showToast: true,
    });

    if (result.allSucceeded) {
      console.log('All requests succeeded:', result.successes);
    } else {
      console.log('Some requests failed:', result.errors);
    }

    return result;
  } catch (error) {
    console.error('Error in multiple API calls:', error);
    throw error;
  }
};

// Multiple API calls with mixed methods
export const createMultipleRecordsExample = async (users, products) => {
  try {
    const requests = [
      {
        url: API_ENDPOINTS.USERS.CREATE,
        method: 'POST',
        body: users,
      },
      {
        url: API_ENDPOINTS.PRODUCTS.CREATE,
        method: 'POST',
        body: products,
      },
    ];

    const result = await apiService.multiple(requests);
    return result;
  } catch (error) {
    throw error;
  }
};

// ============================================
// Example 8: Using in React Component
// ============================================
/*
import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import API_ENDPOINTS from '../config/api.endpoints';

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(API_ENDPOINTS.USERS.LIST);
      setUsers(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      // Loading and toast are handled automatically
      const response = await apiService.post(
        API_ENDPOINTS.USERS.CREATE,
        userData
      );
      // Refresh users list
      fetchUsers();
    } catch (error) {
      // Error toast is shown automatically
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await apiService.delete(API_ENDPOINTS.USERS.DELETE(userId));
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await apiService.uploadFile(
        API_ENDPOINTS.UPLOAD.SINGLE,
        file
      );
      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {loading && <p>Loading...</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default UsersComponent;
*/

