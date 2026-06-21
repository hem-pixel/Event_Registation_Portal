import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-white border-top py-4 mt-auto">
      <div className="container text-center">
        <p className="text-muted mb-1">© {new Date().getFullYear()} EventPortal. All rights reserved.</p>
        <small className="text-muted">Designed for modern college and professional registration management.</small>
      </div>
    </footer>
  );
};

export default Footer;
