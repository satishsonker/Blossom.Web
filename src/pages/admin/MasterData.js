import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import ButtonBox from '../../components/common/ButtonBox';
import apiService from '../../services/api.service';
import API_ENDPOINTS from '../../config/api.endpoints';
import '../../styles/pages/admin/MasterData.css';
import TableView from '../../components/tables/TableView';
import MasterDataFormModal from '../../components/modals/MasterDataFormModal';
import ConfirmModal from '../../components/modals/ConfirmModal';

const MasterData = () => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(null); // 'create', 'edit', 'delete'
  const [tableOption, setTableOption] = useState({});
  
  const breadcrumbItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
    { label: 'Master Data', icon: '📋' },
  ];

  // Define master data fields configuration
  const masterDataFields = [
    { name: 'code', label: 'Code', type: 'text', required: true, prop: 'code' },
    { name: 'name', label: 'Name', type: 'text', required: true, prop: 'name' },
    { name: 'description', label: 'Description', type: 'textarea', required: false, prop: 'description' },
    { name: 'status', label: 'Status', type: 'select', required: true, prop: 'status', options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ]},
    { name: 'category', label: 'Category', type: 'text', required: false, prop: 'category' },
    { name: 'value', label: 'Value', type: 'number', required: false, prop: 'value' },
  ];

  // Table headers configuration
  const tableHeaders = [
    { name: 'Code', prop: 'code', action: { dAlign: 'center', hAlign: 'center' } },
    { name: 'Name', prop: 'name', action: { dAlign: 'left', hAlign: 'left' } },
    { name: 'Description', prop: 'description', action: { dAlign: 'left', hAlign: 'left' } },
    { name: 'Category', prop: 'category', action: { dAlign: 'center', hAlign: 'center' } },
    { name: 'Value', prop: 'value', action: { dAlign: 'right', hAlign: 'right' } },
    { 
      name: 'Status', 
      prop: 'status', 
      action: { 
        dAlign: 'center', 
        hAlign: 'center',
        customColumn: (dataRow) => {
          const status = dataRow.status || 'inactive';
          const isActive = status === 'active';
          return (
            <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        }
      } 
    },
  ];

  // Refresh grid data
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Handle create
  const handleCreate = () => {
    setSelectedItem(null);
    setActionType('create');
    setIsFormModalOpen(true);
  };

  // Handle edit
  const handleEdit = (item) => {
    setSelectedItem(item);
    setActionType('edit');
    setIsFormModalOpen(true);
  };

  // Handle delete
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setActionType('delete');
    setIsConfirmModalOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async (formData) => {
    try {
      if (actionType === 'edit' && selectedItem) {
        await apiService.put(API_ENDPOINTS.MASTER_DATA.UPDATE(selectedItem.id), formData);
      } else {
        await apiService.post(API_ENDPOINTS.MASTER_DATA.CREATE, formData);
      }
      setIsFormModalOpen(false);
      setSelectedItem(null);
      setActionType(null);
      refreshData();
    } catch (error) {
      console.error('Error saving master data:', error);
      throw error;
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      await apiService.delete(API_ENDPOINTS.MASTER_DATA.DELETE(selectedItem.id));
      setIsConfirmModalOpen(false);
      setSelectedItem(null);
      setActionType(null);
      refreshData();
    } catch (error) {
      console.error('Error deleting master data:', error);
    }
  };

  // Fetch data
  useEffect(() => {
    apiService.get(API_ENDPOINTS.MASTER_DATA.LIST, { showLoading: true })
      .then(response => {
        const tableOptionTemplet = {
          headers: tableHeaders,
          showPagination: true,
          showTableTop: true,
          showFooter: true,
          data: response.data?.data || response.data || [],
          totalRecords: response.data?.totalCount || response.data?.length || 0,
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
              title: 'Edit Master Data',
            },
            delete: {
              handler: (dataId, data, index) => handleDeleteClick(data),
              title: 'Delete Master Data',
              showModel: false,
            },
          },
        };
        setTableOption({ ...tableOptionTemplet });
      })
      .catch(error => {
        console.error('Error fetching master data:', error);
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
          <h4>Master Data</h4>
          <p className="master-data-subtitle">Manage master data entries with full CRUD operations</p>
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

      {/* Form Modal */}
      {isFormModalOpen && (
        <MasterDataFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedItem(null);
            setActionType(null);
          }}
          onSave={handleSave}
          fields={masterDataFields}
          initialData={selectedItem}
          mode={actionType}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setSelectedItem(null);
            setActionType(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Master Data"
          message={`Are you sure you want to delete "${selectedItem?.name || selectedItem?.code}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
};

export default MasterData;

