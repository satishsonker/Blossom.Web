import React from 'react';
import '../../styles/components/PublicFooter.css';

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Blooming Buds Learning Center</h3>
            <p>Your trusted partner for excellence.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@BloomingBuds.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Blooming Buds Learning Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

