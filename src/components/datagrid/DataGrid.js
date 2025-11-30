import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/api.service';
import '../../styles/components/DataGrid.css';
import '../../styles/components/DataGrid.row-colors.css';

const DataGrid = ({
  columns = [],
  dataSource = null, // API endpoint or function
  actionColumn = null, // Action column configuration
  header = null,
  footer = null,
  rowKey = 'id',
  pageSize = 10,
  showPagination = true,
  showSearch = true,
  showFilters = true,
  className = '',
  onRowClick = null,
  getRowClassName = null,
  scrollable = true,
  stickyHeader = true,
  stickyActionColumn = true,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeState, setPageSizeState] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState({ field: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!dataSource) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('pageNumber', currentPage);
      params.append('pageSize', pageSizeState);
      
      if (sortConfig.field) {
        params.append('sortBy', sortConfig.field);
        params.append('sortOrder', sortConfig.direction || 'asc');
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(`filter[${key}]`, filters[key]);
        }
      });

      const url = typeof dataSource === 'function' 
        ? dataSource(params) 
        : `${dataSource}?${params.toString()}`;

      const response = await apiService.get(url, { showLoading: false, showToast: false });
      
      // Handle different response structures
      const responseData = response.data?.data || response.data?.items || response.data || [];
      const total = response.data?.total || response.data?.totalRecords || responseData.length;

      setData(responseData);
      setTotalRecords(total);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [dataSource, currentPage, pageSizeState, sortConfig, searchTerm, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle sorting
  const handleSort = (field) => {
    setSortConfig(prev => {
      if (prev.field === field) {
        if (prev.direction === 'asc') {
          return { field, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { field: null, direction: null };
        }
      }
      return { field, direction: 'asc' };
    });
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter
  const handleFilter = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSizeState(size);
    setCurrentPage(1);
  };

  // Render cell content
  const renderCell = (column, row, rowIndex) => {
    const value = row[column.dataIndex];
    const cellValue = column.render ? column.render(value, row, rowIndex) : value;

    if (column.type === 'image') {
      return (
        <div className="datagrid-cell-image">
          <img src={value} alt={column.alt || ''} />
        </div>
      );
    }

    if (column.type === 'link') {
      return (
        <a 
          href={column.href ? column.href(value, row) : value} 
          target={column.target || '_self'}
          className="datagrid-cell-link"
        >
          {cellValue}
        </a>
      );
    }

    if (column.type === 'button') {
      return (
        <button
          onClick={() => column.onClick && column.onClick(value, row, rowIndex)}
          className={`datagrid-cell-button ${column.buttonClass || ''}`}
        >
          {cellValue}
        </button>
      );
    }

    if (column.type === 'badge') {
      const badgeClass = typeof column.badgeClass === 'function' 
        ? column.badgeClass(value, row) 
        : column.badgeClass || '';
      return (
        <span className={`datagrid-cell-badge ${badgeClass}`}>
          {cellValue}
        </span>
      );
    }

    // Text with icon
    if (column.icon) {
      const iconElement = <span className="datagrid-cell-icon">{column.icon}</span>;
      return (
        <div className="datagrid-cell-with-icon">
          {column.iconPosition === 'before' && iconElement}
          <span>{cellValue}</span>
          {column.iconPosition === 'after' && iconElement}
        </div>
      );
    }

    return <span>{cellValue}</span>;
  };

  // Get row class name
  const getRowClass = (row, index) => {
    const classes = ['datagrid-row'];
    if (getRowClassName) {
      const customClass = getRowClassName(row, index);
      if (customClass) classes.push(customClass);
    }
    if (onRowClick) classes.push('datagrid-row-clickable');
    return classes.join(' ');
  };

  const totalPages = Math.ceil(totalRecords / pageSizeState);

  return (
    <div className={`datagrid-container ${className}`}>
      {/* Header */}
      {header && (
        <div className="datagrid-header">
          {typeof header === 'function' ? header({ data, totalRecords }) : header}
        </div>
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="datagrid-toolbar">
          {showSearch && (
            <div className="datagrid-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="datagrid-search-input"
              />
            </div>
          )}
          {showFilters && columns.filter(col => col.filterable).map(column => (
            <div key={column.dataIndex} className="datagrid-filter">
              {column.filterRender ? (
                column.filterRender(filters[column.dataIndex], (value) => handleFilter(column.dataIndex, value))
              ) : (
                <input
                  type="text"
                  placeholder={`Filter ${column.title}...`}
                  value={filters[column.dataIndex] || ''}
                  onChange={(e) => handleFilter(column.dataIndex, e.target.value)}
                  className="datagrid-filter-input"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className={`datagrid-table-wrapper ${scrollable ? 'datagrid-scrollable' : ''}`}>
        <table className="datagrid-table">
          <thead className={`datagrid-thead ${stickyHeader ? 'datagrid-sticky-header' : ''}`}>
            <tr>
              {actionColumn && (
                <th className={`datagrid-th datagrid-action-column ${stickyActionColumn ? 'datagrid-sticky-action' : ''}`}>
                  {actionColumn.title || 'Actions'}
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.dataIndex}
                  className={`datagrid-th ${column.align ? `datagrid-align-${column.align}` : ''} ${column.sortable ? 'datagrid-sortable' : ''}`}
                  onClick={() => column.sortable && handleSort(column.dataIndex)}
                >
                  <div className="datagrid-th-content">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span className="datagrid-sort-icon">
                        {sortConfig.field === column.dataIndex ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : (
                          '⇅'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="datagrid-tbody">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actionColumn ? 1 : 0)} className="datagrid-loading">
                  <div className="datagrid-loading-content">Loading...</div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actionColumn ? 1 : 0)} className="datagrid-empty">
                  <div className="datagrid-empty-content">No data available</div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row[rowKey] || index}
                  className={getRowClass(row, index)}
                  onClick={() => onRowClick && onRowClick(row, index)}
                >
                  {actionColumn && (
                    <td className={`datagrid-td datagrid-action-column ${stickyActionColumn ? 'datagrid-sticky-action' : ''}`}>
                      {actionColumn.render(row, index)}
                    </td>
                  )}
                  {columns.map(column => (
                    <td
                      key={column.dataIndex}
                      className={`datagrid-td ${column.align ? `datagrid-align-${column.align}` : ''}`}
                    >
                      {renderCell(column, row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 0 && (
        <div className="datagrid-pagination">
          <div className="datagrid-pagination-info">
            Showing {((currentPage - 1) * pageSizeState) + 1} to {Math.min(currentPage * pageSizeState, totalRecords)} of {totalRecords} entries
          </div>
          <div className="datagrid-pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="datagrid-pagination-btn"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`datagrid-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="datagrid-pagination-btn"
            >
              Next
            </button>
          </div>
          <div className="datagrid-pagination-size">
            <select
              value={pageSizeState}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="datagrid-pagination-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="datagrid-footer">
          {typeof footer === 'function' ? footer({ data, totalRecords }) : footer}
        </div>
      )}
    </div>
  );
};

export default DataGrid;

