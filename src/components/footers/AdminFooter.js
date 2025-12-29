import React from 'react';
import '../../styles/components/AdminFooter.css';

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <div className="admin-footer-container">
        <p>&copy; {new Date().getFullYear()} Blooming Buds Learning Center Admin Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default AdminFooter;

