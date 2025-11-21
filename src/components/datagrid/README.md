# DataGrid Component Documentation

## Overview

A fully-featured, server-side data grid component with sorting, filtering, pagination, search, and more.

## Features

- ✅ Server-side sorting, filtering, pagination, and search
- ✅ Frozen action column (first column)
- ✅ Multiple column types: image, link, button, badge, text with icon
- ✅ Configurable text alignment per column
- ✅ Conditional row coloring
- ✅ Row hover effects
- ✅ Smooth scrolling
- ✅ Mobile-first responsive design
- ✅ Custom header and footer
- ✅ Sticky header and action column

## Basic Usage

```javascript
import DataGrid from '../components/datagrid/DataGrid';
import API_ENDPOINTS from '../config/api.endpoints';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    sortable: true,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
    filterable: true,
  },
];

<DataGrid
  columns={columns}
  dataSource={API_ENDPOINTS.USERS.LIST}
  rowKey="id"
/>
```

## Props

### Required Props

- `columns` (array): Column configuration array
- `dataSource` (string|function): API endpoint URL or function that returns URL

### Optional Props

- `actionColumn` (object): Action column configuration
- `header` (node|function): Custom header content
- `footer` (node|function): Custom footer content
- `rowKey` (string): Unique key field name (default: 'id')
- `pageSize` (number): Items per page (default: 10)
- `showPagination` (boolean): Show pagination (default: true)
- `showSearch` (boolean): Show search box (default: true)
- `showFilters` (boolean): Show filters (default: true)
- `className` (string): Additional CSS classes
- `onRowClick` (function): Callback when row is clicked
- `getRowClassName` (function): Function to get custom row class name
- `scrollable` (boolean): Enable scrolling (default: true)
- `stickyHeader` (boolean): Sticky header (default: true)
- `stickyActionColumn` (boolean): Sticky action column (default: true)

## Column Configuration

### Basic Column

```javascript
{
  title: 'Name',
  dataIndex: 'name',
  sortable: true,
  filterable: true,
  align: 'left', // 'left' | 'center' | 'right'
}
```

### Image Column

```javascript
{
  title: 'Avatar',
  dataIndex: 'avatar',
  type: 'image',
  align: 'center',
  alt: 'User avatar', // Optional alt text
}
```

### Link Column

```javascript
{
  title: 'Website',
  dataIndex: 'url',
  type: 'link',
  render: (value) => 'Visit Site',
  href: (value, row) => value, // Function to generate href
  target: '_blank', // Link target
}
```

### Button Column

```javascript
{
  title: 'Action',
  dataIndex: 'id',
  type: 'button',
  render: (value) => 'Click Me',
  onClick: (value, row, index) => {
    console.log('Clicked', row);
  },
  buttonClass: 'custom-button-class',
}
```

### Badge Column

```javascript
{
  title: 'Status',
  dataIndex: 'status',
  type: 'badge',
  render: (value) => value.toUpperCase(),
  badgeClass: (value, row) => {
    if (value === 'active') return 'badge-success';
    return 'badge-inactive';
  },
}
```

### Text with Icon

```javascript
{
  title: 'Name',
  dataIndex: 'name',
  icon: '👤', // Emoji or React component
  iconPosition: 'before', // 'before' | 'after'
}
```

### Custom Render

```javascript
{
  title: 'Custom',
  dataIndex: 'custom',
  render: (value, row, index) => {
    return <CustomComponent data={row} />;
  },
}
```

## Action Column

The action column is frozen on the left side and can contain any React elements:

```javascript
const actionColumn = {
  title: 'Actions',
  render: (row, index) => (
    <div>
      <button onClick={() => handleEdit(row)}>Edit</button>
      <button onClick={() => handleDelete(row)}>Delete</button>
    </div>
  ),
};

<DataGrid
  actionColumn={actionColumn}
  // ... other props
/>
```

## Header and Footer

### Static Header/Footer

```javascript
<DataGrid
  header={<h2>Users</h2>}
  footer={<p>Total: 100 users</p>}
  // ... other props
/>
```

### Dynamic Header/Footer

```javascript
const header = ({ data, totalRecords }) => (
  <div>
    <h2>Users</h2>
    <p>Total: {totalRecords} users</p>
  </div>
);

const footer = ({ data, totalRecords }) => {
  const sum = data.reduce((acc, item) => acc + item.value, 0);
  return (
    <div>
      <span>Count: {totalRecords}</span>
      <span>Sum: {sum}</span>
    </div>
  );
};

<DataGrid
  header={header}
  footer={footer}
  // ... other props
/>
```

## Row Styling

### Conditional Row Colors

```javascript
const getRowClassName = (row, index) => {
  if (row.status === 'active') return 'row-success';
  if (row.status === 'inactive') return 'row-warning';
  if (row.status === 'banned') return 'row-error';
  return '';
};

<DataGrid
  getRowClassName={getRowClassName}
  // ... other props
/>
```

Available row color classes:
- `row-success` - Green background
- `row-warning` - Yellow background
- `row-error` - Red background
- `row-info` - Blue background

### Row Click Handler

```javascript
<DataGrid
  onRowClick={(row, index) => {
    console.log('Row clicked', row);
    // Navigate to detail page, etc.
  }}
  // ... other props
/>
```

## Custom Filters

```javascript
{
  title: 'Status',
  dataIndex: 'status',
  filterable: true,
  filterRender: (value, onChange) => (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  ),
}
```

## API Response Format

The DataGrid expects the API to return data in one of these formats:

```javascript
// Format 1
{
  data: [...],
  total: 100
}

// Format 2
{
  items: [...],
  totalRecords: 100
}

// Format 3
[...] // Array directly (total will be array length)
```

### API Query Parameters

The DataGrid automatically sends these query parameters:

- `page` - Current page number
- `pageSize` - Items per page
- `sortBy` - Field to sort by
- `sortOrder` - 'asc' or 'desc'
- `search` - Search term
- `filter[fieldName]` - Filter values

Example API call:
```
GET /api/users?page=1&pageSize=10&sortBy=name&sortOrder=asc&search=john&filter[status]=active
```

## Examples

See `src/examples/DataGrid.example.js` for comprehensive examples.

## Styling

The DataGrid uses CSS variables for theming. Customize colors in your theme:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --border-color: #e2e8f0;
  --text-primary: #1e293b;
  --primary-color: #2563eb;
  /* ... */
}
```

Additional row color classes are available in `DataGrid.row-colors.css`.

