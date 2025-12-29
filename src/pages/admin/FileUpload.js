import React, { useState } from 'react';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import apiService from '../../services/api.service';
import API_ENDPOINTS from '../../config/api.endpoints';
import '../../styles/pages/admin/FileUpload.css';

const FileUpload = () => {
  const [uploadMode, setUploadMode] = useState('single'); // 'single' or 'multiple'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadConfig, setUploadConfig] = useState({
    endpoint: API_ENDPOINTS.UPLOAD.SINGLE,
    fieldName: 'file',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    showProgress: true,
  });
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
    { label: 'File Upload', icon: '📤' },
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file sizes
    const validFiles = files.filter(file => {
      if (file.size > uploadConfig.maxSize) {
        alert(`File ${file.name} exceeds maximum size of ${(uploadConfig.maxSize / 1024 / 1024).toFixed(2)}MB`);
        return false;
      }
      return true;
    });

    if (uploadMode === 'single') {
      setSelectedFiles(validFiles.slice(0, 1));
    } else {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setIsUploading(true);
    setUploadResults([]);
    setUploadProgress({});

    try {
      if (uploadMode === 'single' && selectedFiles.length > 0) {
        // Single file upload
        const file = selectedFiles[0];
        const result = await apiService.uploadFile(
          uploadConfig.endpoint,
          file,
          {
            fieldName: uploadConfig.fieldName,
            showToast: true,
          }
        );
        setUploadResults([{ file: file.name, success: true, data: result.data }]);
      } else {
        // Multiple file upload
        const endpoint = uploadConfig.endpoint === API_ENDPOINTS.UPLOAD.SINGLE 
          ? API_ENDPOINTS.UPLOAD.MULTIPLE 
          : uploadConfig.endpoint;
        
        const result = await apiService.uploadMultipleFiles(
          endpoint,
          selectedFiles,
          {
            fieldName: uploadConfig.fieldName,
            showToast: true,
          }
        );
        setUploadResults(selectedFiles.map((file, index) => ({
          file: file.name,
          success: true,
          data: result.data?.[index] || result.data,
        })));
      }
      
      // Clear selected files after successful upload
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResults(selectedFiles.map(file => ({
        file: file.name,
        success: false,
        error: error.message || 'Upload failed',
      })));
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-page">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="file-upload-header">
        <h1>File Upload</h1>
        <p className="file-upload-subtitle">Upload single or multiple files with configurable options</p>
      </div>

      <div className="file-upload-container">
        {/* Upload Mode Selection */}
        <div className="upload-mode-selector">
          <label>Upload Mode:</label>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${uploadMode === 'single' ? 'active' : ''}`}
              onClick={() => {
                setUploadMode('single');
                setSelectedFiles([]);
                setUploadConfig(prev => ({ ...prev, endpoint: API_ENDPOINTS.UPLOAD.SINGLE }));
              }}
            >
              Single File
            </button>
            <button
              className={`mode-btn ${uploadMode === 'multiple' ? 'active' : ''}`}
              onClick={() => {
                setUploadMode('multiple');
                setSelectedFiles([]);
                setUploadConfig(prev => ({ ...prev, endpoint: API_ENDPOINTS.UPLOAD.MULTIPLE }));
              }}
            >
              Multiple Files
            </button>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="upload-config-panel">
          <h3>Upload Configuration</h3>
          <div className="config-grid">
            <div className="config-item">
              <label>Endpoint:</label>
              <select
                value={uploadConfig.endpoint}
                onChange={(e) => setUploadConfig(prev => ({ ...prev, endpoint: e.target.value }))}
              >
                <option value={API_ENDPOINTS.UPLOAD.SINGLE}>Single Upload</option>
                <option value={API_ENDPOINTS.UPLOAD.MULTIPLE}>Multiple Upload</option>
                <option value={API_ENDPOINTS.UPLOAD.AVATAR}>Avatar Upload</option>
                <option value={API_ENDPOINTS.UPLOAD.DOCUMENT}>Document Upload</option>
              </select>
            </div>
            <div className="config-item">
              <label>Field Name:</label>
              <input
                type="text"
                value={uploadConfig.fieldName}
                onChange={(e) => setUploadConfig(prev => ({ ...prev, fieldName: e.target.value }))}
                placeholder="file"
              />
            </div>
            <div className="config-item">
              <label>Max Size (MB):</label>
              <input
                type="number"
                value={uploadConfig.maxSize / 1024 / 1024}
                onChange={(e) => setUploadConfig(prev => ({ ...prev, maxSize: e.target.value * 1024 * 1024 }))}
                min="1"
                max="100"
              />
            </div>
            <div className="config-item">
              <label>Allowed Types:</label>
              <input
                type="text"
                value={uploadConfig.allowedTypes.join(', ')}
                onChange={(e) => setUploadConfig(prev => ({ ...prev, allowedTypes: e.target.value.split(',').map(t => t.trim()) }))}
                placeholder="image/*, application/pdf"
              />
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="file-upload-area">
          <div className="upload-dropzone">
            <input
              type="file"
              id="file-input"
              multiple={uploadMode === 'multiple'}
              accept={uploadConfig.allowedTypes.join(',')}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="dropzone-label">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <p>Click to select files or drag and drop</p>
              <span className="file-info">
                Max size: {(uploadConfig.maxSize / 1024 / 1024).toFixed(2)}MB
              </span>
            </label>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h4>Selected Files ({selectedFiles.length})</h4>
              <div className="files-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <button
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="upload-actions">
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Uploading...' : `Upload ${uploadMode === 'single' ? 'File' : 'Files'}`}
            </button>
            {selectedFiles.length > 0 && (
              <button
                className="clear-btn"
                onClick={() => setSelectedFiles([])}
                disabled={isUploading}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <div className="upload-results">
            <h3>Upload Results</h3>
            <div className="results-list">
              {uploadResults.map((result, index) => (
                <div key={index} className={`result-item ${result.success ? 'success' : 'error'}`}>
                  <div className="result-icon">
                    {result.success ? '✓' : '✗'}
                  </div>
                  <div className="result-info">
                    <span className="result-file">{result.file}</span>
                    {result.success ? (
                      <span className="result-message">Uploaded successfully</span>
                    ) : (
                      <span className="result-message">{result.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

