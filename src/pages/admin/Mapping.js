import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import ButtonBox from '../../components/common/ButtonBox';
import apiService from '../../services/api.service';
import API_ENDPOINTS from '../../config/api.endpoints';
import '../../styles/pages/admin/MasterData.css';
import TableView from '../../components/tables/TableView';
import MasterDataFormModal from '../../components/modals/MasterDataFormModal';
import ConfirmModal from '../../components/modals/ConfirmModal';

const Mapping = () => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [tableOption, setTableOption] = useState({});
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  
  const breadcrumbItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
    { label: 'Master Data', to: '/admin/master-data', icon: '📋' },
    { label: 'Mapping', icon: '🔗' },
  ];

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [classesRes, subjectsRes, sectionsRes, subsectionsRes] = await Promise.all([
          apiService.post(API_ENDPOINTS.CLASSES.LIST, { pageNumber: 1, pageSize: 1000, searchTerm: '' }, { showLoading: false }),
          apiService.post(API_ENDPOINTS.SUBJECTS.LIST, { pageNumber: 1, pageSize: 1000, searchTerm: '' }, { showLoading: false }),
          apiService.post(API_ENDPOINTS.SECTIONS.LIST, { pageNumber: 1, pageSize: 1000, searchTerm: '' }, { showLoading: false }),
          apiService.post(API_ENDPOINTS.SUBSECTIONS.LIST, { pageNumber: 1, pageSize: 1000, searchTerm: '' }, { showLoading: false }),
        ]);

        setClasses(classesRes.data?.data || []);
        setSubjects(subjectsRes.data?.data || []);
        setSections(sectionsRes.data?.data || []);
        setSubsections(subsectionsRes.data?.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const getFields = () => {
    return [
      { 
        name: 'classId', 
        label: 'Class', 
        type: 'select', 
        required: true, 
        prop: 'classId',
        options: classes.map(cls => ({ value: cls.id, label: `${cls.className} (${cls.classCode})` }))
      },
      { 
        name: 'subjectId', 
        label: 'Subject', 
        type: 'select', 
        required: true, 
        prop: 'subjectId',
        options: subjects.map(sub => ({ value: sub.id, label: `${sub.subjectName} (${sub.subjectCode})` }))
      },
      { 
        name: 'sectionId', 
        label: 'Section', 
        type: 'select', 
        required: true, 
        prop: 'sectionId',
        options: sections.map(sec => ({ value: sec.id, label: `${sec.sectionName} (${sec.sectionCode})` }))
      },
      { 
        name: 'subSectionId', 
        label: 'SubSection', 
        type: 'select', 
        required: true, 
        prop: 'subSectionId',
        options: subsections.map(subsec => ({ value: subsec.id, label: `${subsec.subSectionName} (${subsec.subSectionCode})` }))
      },
    ];
  };

  const tableHeaders = [
    { name: 'ID', prop: 'id', action: { dAlign: 'center', hAlign: 'center' } },
    { name: 'Class', prop: 'className', action: { 
      dAlign: 'left', 
      hAlign: 'left',
    }},
    { name: 'Subject', prop: 'subjectName', action: { 
      dAlign: 'left', 
      hAlign: 'left',
    }},
    { name: 'Section', prop: 'sectionName', action: { 
      dAlign: 'left', 
      hAlign: 'left',
    }},
    { name: 'SubSection', prop: 'subSectionName', action: { 
      dAlign: 'left', 
      hAlign: 'left',
    }},
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
      // Convert string values to numbers for IDs
      const apiData = {
        classId: parseInt(formData.classId),
        subjectId: parseInt(formData.subjectId),
        sectionId: parseInt(formData.sectionId),
        subSectionId: parseInt(formData.subSectionId),
      };

      if (actionType === 'edit' && selectedItem) {
        await apiService.put(API_ENDPOINTS.MAPPING.UPDATE(selectedItem.id), apiData);
      } else {
        await apiService.post(API_ENDPOINTS.MAPPING.CREATE, apiData);
      }
      setIsFormModalOpen(false);
      setSelectedItem(null);
      setActionType(null);
      refreshData();
    } catch (error) {
      console.error('Error saving mapping:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await apiService.delete(API_ENDPOINTS.MAPPING.DELETE(selectedItem.id));
      setIsConfirmModalOpen(false);
      setSelectedItem(null);
      setActionType(null);
      refreshData();
    } catch (error) {
      console.error('Error deleting mapping:', error);
    }
  };

  useEffect(() => {
    const requestBody = {
      pageNumber: pageNo,
      pageSize: pageSize,
      searchTerm: ''
    };

    apiService.post(API_ENDPOINTS.MAPPING.LIST, requestBody, { showLoading: true })
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
              title: 'Edit Mapping',
            },
            delete: {
              handler: (dataId, data, index) => handleDeleteClick(data),
              title: 'Delete Mapping',
              showModel: false,
            },
          },
        };
        setTableOption({ ...tableOptionTemplet });
      })
      .catch(error => {
        console.error('Error fetching mappings:', error);
        setTableOption({
          headers: tableHeaders,
          data: [],
          totalRecords: 0,
        });
      });
  }, [refreshKey, pageNo, pageSize, classes, subjects, sections, subsections]);

  return (
    <div className="master-data-page">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="master-data-header">
        <div>
          <h4>Mapping</h4>
          <p className="master-data-subtitle">Manage class-subject-section-subsection mappings</p>
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
          fields={getFields()}
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
          title="Delete Mapping"
          message="Are you sure you want to delete this mapping? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
};

export default Mapping;

