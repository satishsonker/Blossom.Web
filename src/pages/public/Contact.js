import React from 'react';
import '../../styles/pages/Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contact Us</h1>
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Email: info@BloomingBuds.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Main Street, City, State 12345</p>
          </div>
          <form className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="5" required></textarea>
            </div>
            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

