import React, { useState, useEffect } from 'react';
import '../../styles/components/Modal.css';
import '../../styles/components/UserFormModal.css';

const MasterDataFormModal = ({ isOpen, onClose, onSave, fields = [], initialData = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data based on fields configuration
  useEffect(() => {
    if (isOpen) {
      const initialFormData = {};
      fields.forEach(field => {
        if (initialData && mode === 'edit') {
          initialFormData[field.name] = initialData[field.prop] || initialData[field.name] || '';
        } else {
          initialFormData[field.name] = field.type === 'select' ? (field.options?.[0]?.value || '') : '';
        }
      });
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen, initialData, mode, fields]);

  const validate = () => {
    const newErrors = {};

    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }

      // Additional validations
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Invalid email format';
        }
      }

      if (field.type === 'number' && formData[field.name]) {
        if (isNaN(formData[field.name])) {
          newErrors[field.name] = `${field.label} must be a number`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Map form data to API format
      const apiData = {};
      fields.forEach(field => {
        const value = formData[field.name];
        if (value !== undefined && value !== null && value !== '') {
          apiData[field.prop] = field.type === 'number' ? parseFloat(value) : value;
        }
      });

      await onSave(apiData);
    } catch (error) {
      console.error('Error saving master data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderField = (field) => {
    const fieldValue = formData[field.name] || '';
    const fieldError = errors[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleChange}
              rows={4}
              className={fieldError ? 'error' : ''}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {fieldError && <span className="error-message">{fieldError}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleChange}
              className={fieldError ? 'error' : ''}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && <span className="error-message">{fieldError}</span>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="number"
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleChange}
              className={fieldError ? 'error' : ''}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {fieldError && <span className="error-message">{fieldError}</span>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleChange}
              className={fieldError ? 'error' : ''}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {fieldError && <span className="error-message">{fieldError}</span>}
          </div>
        );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Master Data' : 'Create Master Data'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-fields">
            {fields.map(field => renderField(field))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterDataFormModal;

