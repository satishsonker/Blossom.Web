import React, { useState, useEffect } from 'react';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import Dropdown from '../common/Dropdown';
import ButtonBox from '../common/ButtonBox';
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
          const value = initialData[field.prop] !== undefined ? initialData[field.prop] : (initialData[field.name] !== undefined ? initialData[field.name] : '');
          // Convert boolean to string for select fields
          if (field.type === 'select' && typeof value === 'boolean') {
            initialFormData[field.name] = String(value);
          } else {
            initialFormData[field.name] = value || '';
          }
        } else {
          initialFormData[field.name] = field.type === 'select' ? (field.options?.[0]?.value !== undefined ? String(field.options[0].value) : '') : '';
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
        // Check if value is empty (but allow false for booleans and 0 for numbers)
        const isEmpty = value === undefined || value === null || value === '' || (typeof value === 'string' && !value.trim());
        if (isEmpty) {
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
          if (field.type === 'number') {
            apiData[field.prop] = parseFloat(value);
          } else if (field.type === 'select' && (value === 'true' || value === 'false')) {
            // Convert string boolean to actual boolean
            apiData[field.prop] = value === 'true';
          } else if (field.type === 'select' && !isNaN(value) && value !== '') {
            // Convert string number to number for select fields (like IDs)
            apiData[field.prop] = parseInt(value);
          } else {
            apiData[field.prop] = value;
          }
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
            <Inputbox
              labelText={field.label}
              isRequired={field.required}
              type="text"
              name={field.name}
              value={fieldValue}
              onChangeHandler={handleChange}
              errorMessage={fieldError}
              showError={true}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={fieldError ? 'error' : ''}
            />
          </div>
        );

      case 'select':
        const dropdownData = field.options?.map(opt => ({
          id: String(opt.value),
          value: opt.label
        })) || [];
        return (
          <div key={field.name} className="form-group">
            <Label text={field.label} isRequired={field.required} />
            <Dropdown
              name={field.name}
              value={String(fieldValue)}
              data={dropdownData}
              elementKey="id"
              text="value"
              onChange={(e) => {
                const newEvent = {
                  target: {
                    name: field.name,
                    value: e.target.value
                  }
                };
                handleChange(newEvent);
              }}
              defaultText={`Select ${field.label}`}
              className={fieldError ? 'error' : ''}
            />
            <ErrorLabel message={fieldError} />
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="form-group">
            <Inputbox
              labelText={field.label}
              isRequired={field.required}
              type="number"
              name={field.name}
              value={fieldValue}
              onChangeHandler={handleChange}
              errorMessage={fieldError}
              showError={true}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={fieldError ? 'error' : ''}
            />
          </div>
        );

      default:
        return (
          <div key={field.name} className="form-group">
            <Inputbox
              labelText={field.label}
              isRequired={field.required}
              type={field.type || 'text'}
              name={field.name}
              id={field.name}
              value={fieldValue}
              onChangeHandler={handleChange}
              errorMessage={fieldError}
              showError={true}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={fieldError ? 'error' : ''}
            />
          </div>
        );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Master Data' : 'Create Master Data'}</h2>
          <button className="modal-close" onClick={onClose} title="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-fields">
            {fields.map(field => renderField(field))}
          </div>

          <div className="form-actions">
            <ButtonBox
              type="cancel"
              onClickHandler={onClose}
              className="btn-sm"
              disabled={isSubmitting}
              text="Cancel"
            />
            <button
              type="submit"
              className="btn btn-sm btn-info"
              disabled={isSubmitting}
            >
              <i className={mode === 'edit' ? 'bi bi-arrow-clockwise' : 'bi bi-save'}></i>
              {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterDataFormModal;

