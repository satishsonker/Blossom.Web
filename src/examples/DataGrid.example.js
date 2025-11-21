/**
 * DataGrid Usage Examples
 */

import DataGrid from '../components/datagrid/DataGrid';
import API_ENDPOINTS from '../config/api.endpoints';

// Example 1: Basic DataGrid with API
export const BasicDataGrid = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sortable: true,
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      filterable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      filterable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      type: 'badge',
      render: (value) => value,
      badgeClass: value => value === 'active' ? 'badge-success' : 'badge-inactive',
    },
  ];

  const actionColumn = {
    title: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => console.log('Edit', row)}>Edit</button>
        <button onClick={() => console.log('Delete', row)}>Delete</button>
      </div>
    ),
  };

  return (
    <DataGrid
      columns={columns}
      dataSource={API_ENDPOINTS.USERS.LIST}
      actionColumn={actionColumn}
      rowKey="id"
      pageSize={10}
    />
  );
};

// Example 2: DataGrid with Images and Links
export const DataGridWithImages = () => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      sortable: true,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      type: 'image',
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sortable: true,
      align: 'right',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Link',
      dataIndex: 'url',
      type: 'link',
      render: (value) => 'View Product',
      href: (value) => value,
      target: '_blank',
    },
  ];

  return (
    <DataGrid
      columns={columns}
      dataSource={API_ENDPOINTS.PRODUCTS.LIST}
      rowKey="id"
    />
  );
};

// Example 3: DataGrid with Icons and Buttons
export const DataGridWithIcons = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      icon: '👤',
      iconPosition: 'before',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      icon: '📧',
      iconPosition: 'before',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      type: 'button',
      render: (value) => 'View Details',
      onClick: (value, row) => console.log('View', row),
      buttonClass: 'btn-primary',
    },
  ];

  return (
    <DataGrid
      columns={columns}
      dataSource={API_ENDPOINTS.USERS.LIST}
      rowKey="id"
    />
  );
};

// Example 4: DataGrid with Conditional Row Colors
export const DataGridWithRowColors = () => {
  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Status', dataIndex: 'status' },
  ];

  const getRowClassName = (row) => {
    if (row.status === 'active') return 'row-success';
    if (row.status === 'inactive') return 'row-warning';
    if (row.status === 'banned') return 'row-error';
    return '';
  };

  return (
    <DataGrid
      columns={columns}
      dataSource={API_ENDPOINTS.USERS.LIST}
      rowKey="id"
      getRowClassName={getRowClassName}
    />
  );
};

// Example 5: DataGrid with Custom Header and Footer
export const DataGridWithHeaderFooter = () => {
  const columns = [
    { title: 'Product', dataIndex: 'name', sortable: true },
    { title: 'Price', dataIndex: 'price', sortable: true, align: 'right' },
    { title: 'Quantity', dataIndex: 'quantity', sortable: true, align: 'right' },
  ];

  const header = ({ totalRecords }) => (
    <div>
      <h2>Products</h2>
      <p>Total: {totalRecords} products</p>
    </div>
  );

  const footer = ({ data, totalRecords }) => {
    const totalPrice = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Total Records: {totalRecords}</span>
        <span>Total Value: ${totalPrice.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      dataSource={API_ENDPOINTS.PRODUCTS.LIST}
      rowKey="id"
      header={header}
      footer={footer}
    />
  );
};

// Example 6: DataGrid with Custom Filters
export const DataGridWithCustomFilters = () => {
  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      filterable: true,
      filterRender: (value, onChange) => (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ padding: '0.5rem', width: '100%' }}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      ),
    },
    { title: 'Name', dataIndex: 'name', filterable: true },
    { title: 'Email', dataIndex: 'email', filterable: true },
  ];

  return (
    <DataGrid
      columns={columns}
      dataSource={API_ENDPOINTS.USERS.LIST}
      rowKey="id"
    />
  );
};

// Example 7: Full Featured DataGrid
export const FullFeaturedDataGrid = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sortable: true,
      align: 'center',
      width: 80,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      type: 'image',
      align: 'center',
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
      href: (value) => `mailto:${value}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      type: 'badge',
      render: (value) => value.toUpperCase(),
      badgeClass: (value) => {
        if (value === 'active') return 'badge-success';
        if (value === 'inactive') return 'badge-warning';
        return 'badge-error';
      },
      align: 'center',
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      type: 'button',
      render: () => 'View',
      onClick: (value, row) => console.log('View', row),
      align: 'center',
    },
  ];

  const actionColumn = {
    title: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <button onClick={() => console.log('Edit', row)}>Edit</button>
        <button onClick={() => console.log('Delete', row)}>Delete</button>
      </div>
    ),
  };

  const header = ({ totalRecords }) => (
    <div>
      <h2>User Management</h2>
      <p>Total Users: {totalRecords}</p>
    </div>
  );

  const footer = ({ data }) => {
    const activeCount = data.filter(item => item.status === 'active').length;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Total: {data.length} users</span>
        <span>Active: {activeCount} users</span>
      </div>
    );
  };

  const getRowClassName = (row) => {
    if (row.status === 'active') return 'row-success';
    if (row.status === 'inactive') return 'row-warning';
    return '';
  };

  return (
    <DataGrid
      columns={columns}
      dataSource={API_ENDPOINTS.USERS.LIST}
      actionColumn={actionColumn}
      header={header}
      footer={footer}
      rowKey="id"
      pageSize={25}
      getRowClassName={getRowClassName}
      onRowClick={(row) => console.log('Row clicked', row)}
      stickyHeader={true}
      stickyActionColumn={true}
    />
  );
};

