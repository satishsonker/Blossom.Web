import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../headers/PublicHeader';
import PublicFooter from '../footers/PublicFooter';
import '../../styles/layouts/PublicLayout.css';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <PublicHeader />
      <main className="public-main">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;

