import React from 'react';
import '../../styles/pages/admin/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p className="stat-number">1,234</p>
          <span className="stat-change positive">+12%</span>
        </div>
        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p className="stat-number">567</p>
          <span className="stat-change positive">+8%</span>
        </div>
        <div className="dashboard-card">
          <h3>Revenue</h3>
          <p className="stat-number">$45,678</p>
          <span className="stat-change positive">+15%</span>
        </div>
        <div className="dashboard-card">
          <h3>Orders</h3>
          <p className="stat-number">890</p>
          <span className="stat-change negative">-3%</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

