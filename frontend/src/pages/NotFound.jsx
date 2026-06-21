import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card premium-card border-0 p-5 shadow-sm">
            <h1 className="display-1 fw-extrabold text-primary mb-3">404</h1>
            <h3 className="fw-bold text-dark mb-3">Page Not Found</h3>
            <p className="text-secondary mb-4">
              Oops! The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/events" className="btn btn-premium rounded-pill px-4 py-2">
              Go to Events Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
// Exporting default
