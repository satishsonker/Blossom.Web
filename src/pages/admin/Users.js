import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import DataGrid from '../../components/datagrid/DataGrid';
import UserFormModal from '../../components/modals/UserFormModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import apiService from '../../services/api.service';
import API_ENDPOINTS from '../../config/api.endpoints';
import '../../styles/pages/admin/Users.css';

const Users = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null); // 'edit', 'delete', 'activate', 'deactivate', 'resetPassword'

  const breadcrumbItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
    { label: 'Users', icon: '👥' },
  ];

  // Refresh grid data
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Handle create user
  const handleCreateUser = () => {
    setSelectedUser(null);
    setActionType(null);
    setIsFormModalOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setActionType('edit');
    setIsFormModalOpen(true);
  };

  // Handle save user (create or update)
  const handleSaveUser = async (userData) => {
    try {
      if (actionType === 'edit' && selectedUser) {
        await apiService.put(API_ENDPOINTS.USERS.UPDATE(selectedUser.id), userData);
      } else {
        await apiService.post(API_ENDPOINTS.USERS.REGISTER, userData);
      }
      refreshData();
    } catch (error) {
      throw error;
    }
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setActionType('delete');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiService.delete(API_ENDPOINTS.USERS.DELETE(selectedUser.id));
      refreshData();
      setIsConfirmModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle activate user
  const handleActivateUser = async (user) => {
    try {
      await apiService.put(API_ENDPOINTS.USERS.ACTIVATE(user.id), {});
      refreshData();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  // Handle deactivate user
  const handleDeactivateUser = async (user) => {
    try {
      await apiService.put(API_ENDPOINTS.USERS.DEACTIVATE(user.id), {});
      refreshData();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  // Handle reset password
  const handleResetPasswordClick = (user) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleConfirmResetPassword = async () => {
    try {
      await apiService.post(API_ENDPOINTS.USERS.RESET_PASSWORD(selectedUser.id), {});
      setIsResetPasswordModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  // DataGrid columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sortable: true,
      align: 'center',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      filterable: true,
      icon: '👤',
      iconPosition: 'before',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      filterable: true,
      type: 'link',
      render: (value) => value,
      href: (value) => `mailto:${value}`,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
      filterable: true,
      type: 'badge',
      render: (value) => value.toUpperCase(),
      badgeClass: (value) => {
        if (value === 'admin') return 'badge-error';
        if (value === 'moderator') return 'badge-warning';
        return 'badge-info';
      },
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      filterable: true,
      type: 'badge',
      render: (value) => value.toUpperCase(),
      badgeClass: (value) => {
        if (value === 'active') return 'badge-success';
        if (value === 'inactive') return 'badge-warning';
        if (value === 'suspended') return 'badge-error';
        return 'badge-inactive';
      },
      align: 'center',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      filterable: true,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleDateString();
      },
    },
  ];

  // Action column configuration
  const actionColumn = {
    title: 'Actions',
    render: (row) => (
      <div className="user-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditUser(row);
          }}
          className="action-btn action-edit"
          title="Edit User"
        >
          ✏️
        </button>
        {row.status === 'active' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeactivateUser(row);
            }}
            className="action-btn action-deactivate"
            title="Deactivate User"
          >
            ⏸️
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleActivateUser(row);
            }}
            className="action-btn action-activate"
            title="Activate User"
          >
            ▶️
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleResetPasswordClick(row);
          }}
          className="action-btn action-reset"
          title="Reset Password"
        >
          🔑
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(row);
          }}
          className="action-btn action-delete"
          title="Delete User"
        >
          🗑️
        </button>
      </div>
    ),
  };

  // Header component
  const header = ({ totalRecords }) => (
    <div className="users-header">
      <div>
        <h1>User Management</h1>
        <p className="users-subtitle">Total Users: {totalRecords}</p>
      </div>
      <button onClick={handleCreateUser} className="btn-primary btn-create-user">
        ➕ Create New User
      </button>
    </div>
  );

  // Footer component
  const footer = ({ data }) => {
    const activeCount = data.filter(item => item.status === 'active').length;
    const inactiveCount = data.filter(item => item.status === 'inactive').length;
    const adminCount = data.filter(item => item.role === 'admin').length;

    return (
      <div className="users-footer">
        <div className="footer-stat">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{data.length}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Active:</span>
          <span className="stat-value stat-success">{activeCount}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Inactive:</span>
          <span className="stat-value stat-warning">{inactiveCount}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Admins:</span>
          <span className="stat-value stat-info">{adminCount}</span>
        </div>
      </div>
    );
  };

  // Get row class name based on status
  const getRowClassName = (row) => {
    if (row.status === 'active') return 'row-success';
    if (row.status === 'inactive') return 'row-warning';
    if (row.status === 'suspended') return 'row-error';
    return '';
  };

  // Custom data source function to include refresh key
  const dataSource = useCallback((params) => {
    return `${API_ENDPOINTS.USERS.LIST}?${params.toString()}&_refresh=${refreshKey}`;
  }, [refreshKey]);

  return (
    <div className="users-page">
      <Breadcrumb items={breadcrumbItems} />
      
      <DataGrid
        key={refreshKey}
        columns={columns}
        dataSource={dataSource}
        actionColumn={actionColumn}
        header={header}
        footer={footer}
        rowKey="id"
        pageSize={25}
        getRowClassName={getRowClassName}
        stickyHeader={true}
        stickyActionColumn={true}
      />

      {/* Create/Edit User Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedUser(null);
          setActionType(null);
        }}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={actionType === 'edit' ? 'edit' : 'create'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Reset Password Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => {
          setIsResetPasswordModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmResetPassword}
        title="Reset Password"
        message={`Are you sure you want to reset password for user "${selectedUser?.name}"? A new password will be generated and sent to their email.`}
        confirmText="Reset Password"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default Users;
