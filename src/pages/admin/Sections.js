import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import apiService from '../../services/api.service';
import API_ENDPOINTS from '../../config/api.endpoints';
import '../../styles/pages/admin/MasterData.css';
import TableView from '../../components/tables/TableView';
import MasterDataFormModal from '../../components/modals/MasterDataFormModal';
import ConfirmModal from '../../components/modals/ConfirmModal';

const Sections = () => {
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
    { label: 'Sections', icon: '📑' },
  ];

  const fields = [
    { name: 'sectionName', label: 'Section Name', type: 'text', required: true, prop: 'sectionName' },
    { name: 'sectionCode', label: 'Section Code', type: 'text', required: true, prop: 'sectionCode' },
    { name: 'displayOrder', label: 'Display Order', type: 'number', required: false, prop: 'displayOrder' },
    { name: 'isActive', label: 'Is Active', type: 'select', required: true, prop: 'isActive', options: [
      { value: true, label: 'Active' },
      { value: false, label: 'Inactive' },
    ]},
  ];

  const tableHeaders = [
    { name: 'ID', prop: 'id', action: { dAlign: 'center', hAlign: 'center' } },
    { name: 'Section Name', prop: 'sectionName', action: { dAlign: 'left', hAlign: 'left' } },
    { name: 'Section Code', prop: 'sectionCode', action: { dAlign: 'center', hAlign: 'center' } },
    { name: 'Display Order', prop: 'displayOrder', action: { dAlign: 'center', hAlign: 'center' } },
    { 
      name: 'Status', 
      prop: 'isActive', 
      action: { 
        dAlign: 'center', 
        hAlign: 'center',
        customColumn: (dataRow) => {
          const isActive = dataRow.isActive;
          return (
            <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
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
        await apiService.put(API_ENDPOINTS.SECTIONS.UPDATE(selectedItem.id), formData);
      } else {
        await apiService.post(API_ENDPOINTS.SECTIONS.CREATE, formData);
      }
      setIsFormModalOpen(false);
      setSelectedItem(null);
      setActionType(null);
      refreshData();
    } catch (error) {
      console.error('Error saving section:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await apiService.delete(API_ENDPOINTS.SECTIONS.DELETE(selectedItem.id));
      setIsConfirmModalOpen(false);
      setSelectedItem(null);
      setActionType(null);
      refreshData();
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  useEffect(() => {
    const requestBody = {
      pageNumber: pageNo,
      pageSize: pageSize,
      searchTerm: ''
    };

    apiService.post(API_ENDPOINTS.SECTIONS.LIST, requestBody, { showLoading: true })
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
          actions: {
            showView: false,
            showPrint: false,
            showDelete: true,
            showEdit: true,
            edit: {
              handler: (dataId, data) => handleEdit(data),
              title: 'Edit Section',
            },
            delete: {
              handler: (dataId, data, index) => handleDeleteClick(data),
              title: 'Delete Section',
              showModel: false,
            },
          },
        };
        setTableOption({ ...tableOptionTemplet });
      })
      .catch(error => {
        console.error('Error fetching sections:', error);
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
          <h1>Sections</h1>
          <p className="master-data-subtitle">Manage section entries with full CRUD operations</p>
        </div>
        <button className="btn-create" onClick={handleCreate}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Add New
        </button>
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
          title="Delete Section"
          message={`Are you sure you want to delete "${selectedItem?.sectionName || selectedItem?.sectionCode}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
};

export default Sections;

