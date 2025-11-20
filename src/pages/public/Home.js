import React from 'react';
import '../../styles/pages/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="container">
        <section className="hero">
          <h1>Welcome to Blossom</h1>
          <p className="hero-subtitle">
            Your trusted partner for excellence and innovation
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </section>

        <section className="features">
          <h2>Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast & Reliable</h3>
              <p>Lightning-fast performance with 99.9% uptime guarantee</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Enterprise-grade security to protect your data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Innovative</h3>
              <p>Cutting-edge technology for modern solutions</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

