import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../headers/AdminHeader';
import AdminFooter from '../footers/AdminFooter';
import AdminSidebar from '../sidebar/AdminSidebar';
import '../../styles/layouts/AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="admin-content-wrapper">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;

