import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      className="navbar navbar-expand-lg custom-navbar sticky-top"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-calendar-event-fill me-2 fs-4"></i>
          <span>EventPortal</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/events">Events</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-premium dropdown-toggle d-flex align-items-center px-3 py-2 rounded-pill fw-medium"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2 fs-5"></i>
                  <span>{user.name}</span>
                  {isAdmin && <span className="badge bg-danger ms-2" style={{ fontSize: '0.7rem' }}>Admin</span>}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 rounded-4" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person me-2"></i> Profile
                    </Link>
                  </li>
                  {!isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2" to="/feedback/history">
                        <i className="bi bi-chat-left-text me-2"></i> My Feedback
                      </Link>
                    </li>
                  )}
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2" to="/admin/feedback">
                        <i className="bi bi-bar-chart me-2"></i> Feedback Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="gap-2 d-flex">
                <Link className="btn btn-link text-decoration-none text-light fw-medium" to="/login">Login</Link>
                <Link className="btn btn-premium rounded-pill px-4" to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
