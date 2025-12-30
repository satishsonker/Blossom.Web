import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import ButtonBox from '../../components/common/ButtonBox';
import apiService from '../../services/api.service';
import API_ENDPOINTS from '../../config/api.endpoints';
import '../../styles/pages/admin/MasterData.css';
import TableView from '../../components/tables/TableView';
import MasterDataFormModal from '../../components/modals/MasterDataFormModal';
import ConfirmModal from '../../components/modals/ConfirmModal';

const Classes = () => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [tableOption, setTableOption] = useState({});
  
  const breadcrumbItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
    { label: 'Master Data', to: '/admin/master-data', icon: '📋' },
    { label: 'Classes', icon: '📚' },
  ];

  const fields = [
    { name: 'className', label: 'Class Name', type: 'text', required: true, prop: 'className' },
    { name: 'classCode', label: 'Class Code', type: 'text', required: true, prop: 'classCode' },
    { name: 'classShortName', label: 'Class Short Name', type: 'text', required: false, prop: 'classShortName' },
    { name: 'displayOrder', label: 'Display Order', type: 'number', required: false, prop: 'displayOrder' },
    { name: 'isActive', label: 'Is Active', type: 'select', required: true, prop: 'isActive', options: [
      { value: true, label: 'Active' },
      { value: false, label: 'Inactive' },
    ]},
  ];

  const tableHeaders = [
    { name: 'Class Name', prop: 'className', action: { dAlign: 'left', hAlign: 'left' } },
    { name: 'Class Code', prop: 'classCode', action: { dAlign: 'center', hAlign: 'center' } },
    { name: 'Short Name', prop: 'classShortName', action: { dAlign: 'center', hAlign: 'center' } },
    { name: 'Display Order', prop: 'displayOrder', action: { dAlign: 'center', hAlign: 'center' } },
    { 
      name: 'Status', 
      prop: 'isActive', 
      action: { 
        dAlign: 'center', 
        hAlign: 'center',
        customColumn: (dataRow) => {
          return (
            <span className={`status-badge ${dataRow.isActive==true ? 'status-active' : 'status-inactive'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          );
        }
      } 
    },
  ];

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setActionType('create');
    setIsFormModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setActionType('edit');
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setActionType('delete');
    setIsConfirmModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (actionType === 'edit' && selectedItem) {
        await apiService.put(API_ENDPOINTS.CLASSES.UPDATE(selectedItem.id), formData);
      } else {
        await apiService.post(API_ENDPOINTS.CLASSES.CREATE, formData);
      }
      setIsFormModalOpen(false);
      setSelectedItem(null);
      setActionType(null);
      refreshData();
    } catch (error) {
      console.error('Error saving class:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await apiService.delete(API_ENDPOINTS.CLASSES.DELETE(selectedItem.id));
      setIsConfirmModalOpen(false);
      setSelectedItem(null);
      setActionType(null);
      refreshData();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  useEffect(() => {
    const requestBody = {
      pageNumber: pageNo,
      pageSize: pageSize,
      searchTerm: ''
    };

    apiService.post(API_ENDPOINTS.CLASSES.LIST, requestBody, { showLoading: true })
      .then(response => {
        const tableOptionTemplet = {
          headers: tableHeaders,
          showPagination: true,
          showTableTop: true,
          showFooter: true,
          data: response.data?.data || [],
          totalRecords: response.data?.totalCount || 0,
          pageSize: pageSize,
          pageNo: pageNo,
          setPageNo: setPageNo,
          setPageSize: setPageSize,
          refreshData: refreshData,
          actions: {
            showView: false,
            showPrint: false,
            showDelete: true,
            showEdit: true,
            edit: {
              handler: (dataId, data) => handleEdit(data),
              title: 'Edit Class',
            },
            delete: {
              handler: (dataId, data, index) => handleDeleteClick(data),
              title: 'Delete Class',
              showModel: false,
            },
          },
        };
        setTableOption({ ...tableOptionTemplet });
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
        setTableOption({
          headers: tableHeaders,
          data: [],
          totalRecords: 0,
        });
      });
  }, [refreshKey, pageNo, pageSize]);

  return (
    <div className="master-data-page">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="master-data-header">
        <div>
          <h4>Classes</h4>
          <p className="master-data-subtitle">Manage class entries with full CRUD operations</p>
        </div>
        <ButtonBox
          type="add"
          onClickHandler={handleCreate}
          className="btn-sm"
          text="Add New"
        />
      </div>

      <div className="master-data-content">
        {tableOption.headers && tableOption.headers.length > 0 && (
          <TableView option={tableOption} />
        )}
      </div>

      {isFormModalOpen && (
        <MasterDataFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedItem(null);
            setActionType(null);
          }}
          onSave={handleSave}
          fields={fields}
          initialData={selectedItem}
          mode={actionType}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setSelectedItem(null);
            setActionType(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Class"
          message={`Are you sure you want to delete "${selectedItem?.className || selectedItem?.classCode}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
};

export default Classes;

