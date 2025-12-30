import React, { useState, useEffect } from 'react';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import Dropdown from '../common/Dropdown';
import ButtonBox from '../common/ButtonBox';
import '../../styles/components/Modal.css';
import '../../styles/components/UserFormModal.css';

const UserFormModal = ({ isOpen, onClose, onSave, user = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'active',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'user',
        status: user.status || 'active',
        phone: user.phone || '',
        address: user.address || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        status: 'active',
        phone: '',
        address: '',
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

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
      const dataToSave = { ...formData };
      // Remove password fields if not changing password in edit mode
      if (mode === 'edit' && !dataToSave.password) {
        delete dataToSave.password;
        delete dataToSave.confirmPassword;
      } else {
        delete dataToSave.confirmPassword;
      }

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'create' ? 'Create New User' : 'Edit User'}</h2>
          <button className="modal-close" onClick={onClose} title="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-row">
            <div className="form-group">
              <Inputbox
                labelText="Name"
                isRequired={true}
                type="text"
                name="name"
                value={formData.name}
                onChangeHandler={handleChange}
                errorMessage={errors.name}
                showError={true}
                placeholder="Enter full name"
                className={errors.name ? 'error' : ''}
              />
            </div>

            <div className="form-group">
              <Inputbox
                labelText="Email"
                isRequired={true}
                type="email"
                name="email"
                value={formData.email}
                onChangeHandler={handleChange}
                errorMessage={errors.email}
                showError={true}
                placeholder="Enter email address"
                className={errors.email ? 'error' : ''}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Label text="Role" isRequired={true} />
              <Dropdown
                name="role"
                value={formData.role}
                data={[
                  { id: 'user', value: 'User' },
                  { id: 'admin', value: 'Admin' },
                  { id: 'moderator', value: 'Moderator' }
                ]}
                elementKey="id"
                text="value"
                onChange={handleChange}
                defaultText="Select Role"
                className={errors.role ? 'error' : ''}
              />
              <ErrorLabel message={errors.role} />
            </div>

            <div className="form-group">
              <Label text="Status" isRequired={true} />
              <Dropdown
                name="status"
                value={formData.status}
                data={[
                  { id: 'active', value: 'Active' },
                  { id: 'inactive', value: 'Inactive' },
                  { id: 'suspended', value: 'Suspended' }
                ]}
                elementKey="id"
                text="value"
                onChange={handleChange}
                defaultText="Select Status"
                className={errors.status ? 'error' : ''}
              />
              <ErrorLabel message={errors.status} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Inputbox
                labelText="Phone"
                isRequired={false}
                type="tel"
                name="phone"
                value={formData.phone}
                onChangeHandler={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <Inputbox
                labelText="Address"
                isRequired={false}
                type="text"
                name="address"
                value={formData.address}
                onChangeHandler={handleChange}
                placeholder="Enter address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Inputbox
                labelText={mode === 'create' ? 'Password' : 'New Password'}
                isRequired={mode === 'create'}
                type="password"
                name="password"
                value={formData.password}
                onChangeHandler={handleChange}
                errorMessage={errors.password}
                showError={true}
                placeholder={mode === 'create' ? 'Enter password' : 'Leave blank to keep current password'}
                className={errors.password ? 'error' : ''}
              />
            </div>

            {formData.password && (
              <div className="form-group">
                <Inputbox
                  labelText="Confirm Password"
                  isRequired={true}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChangeHandler={handleChange}
                  errorMessage={errors.confirmPassword}
                  showError={true}
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
              </div>
            )}
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
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

