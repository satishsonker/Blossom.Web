import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import UserFormModal from '../../components/modals/UserFormModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import apiService from '../../services/api.service';
import API_ENDPOINTS from '../../config/api.endpoints';
import '../../styles/pages/admin/Users.css';
import TableView from '../../components/tables/TableView';
import { headerFormat } from './../../utils/tableHeaderFormat';

const Users = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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
  const handleActivateUser = async (user, active) => {
    try {
      await apiService.post(API_ENDPOINTS.USERS.ACTIVATE(user.id, active), {});
      refreshData();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const verifyEmail = async (user) => {
    try {
      await apiService.post(API_ENDPOINTS.USERS.VERIFY_EMAIL(user.id), {});
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



  useEffect(() => {
    apiService.get(API_ENDPOINTS.USERS.LIST).then(response => {
      tableOptionTemplet.data = response.data.data
      tableOptionTemplet.totalRecords = response.data.totalCount;
      setTableOption({ ...tableOptionTemplet });
    }).catch(error => {
      console.error('Error fetching users data:', error);
    })
  }, [refreshKey])

  const tableOptionTemplet = {
    headers: headerFormat.userList,
    showPagination: false,
    showTableTop: false,
    showFooter: true,
    data: [],
    totalRecords: 0,
    pageSize: pageSize,
    pageNo: pageNo,
    setPageNo: setPageNo,
    setPageSize: setPageSize,
    actions: {
      showView: true,
      showPrint: false,
      showDelete: true,
      showEdit: false,
      delete: {
        handler: (dataId, data, index) => {
          handleDeleteClick(data)
        },
        title: "Delete User",
        icon: 'bi bi-trash-fill',
        showModel: false
      },

      edit: {
        handler: (dataId, data) => {
          handleEditUser(data)
        }
      },
      buttons: [
        {
          title: "Reset Password",
          icon: 'bi bi-key-fill',
          handler: (dataId, data) => {
            handleResetPasswordClick(data)
          }
        },
        {
          title: "Activate",
          icon: 'bi bi-check-circle-fill text-success',
          showModel: false,
          handler: (dataId, data) => {
            handleActivateUser(data, true)
          },
          show: (data, datalength) => {
            return !data.isActive;
          }
        },
        {
          title: "Deactivate",
          icon: 'bi bi-x-circle-fill text-danger',
          showModel: false,
          handler: (dataId, data) => {
            handleActivateUser(data, false)
          },
          show: (data, datalength) => {
            return data.isActive;
          }
        },
        {
          title: "Verify Email",
          icon: 'bi bi-x-circle-fill text-danger',
          showModel: false,
          handler: (dataId, data) => {
            verifyEmail(data)
          },
          show: (data, datalength) => {
            return data.isEmailVerified;
          }
        },
        {
          title: "Reset Password",
          icon: 'bi bi-x-circle-fill text-danger',
          showModel: false,
          handler: (dataId, data) => {
            verifyEmail(data)
          },
          show: (data, datalength) => {
            return data.isEmailVerified;
          }
        },
        {
          title: "Verify Email",
          icon: 'bi bi-x-circle-fill text-danger',
          showModel: false,
          handler: (dataId, data) => {
            changePassword(data)
          },
          show: (data, datalength) => {
            return data.isEmailVerified;
          }
        }
      ],
      view: {
        handler: () => { navigate('/admin/orders/view/' + selectedUser?.id) },
        title: "View user profile"
      }
    }
  }

  const [tableOption, setTableOption] = useState(tableOptionTemplet);
  return (
    <div className="users-page">
      <Breadcrumb items={breadcrumbItems} />
      <TableView option={tableOption}></TableView>
      
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
        message={`Are you sure you want to delete user "${selectedUser?.email}"? This action cannot be undone.`}
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
