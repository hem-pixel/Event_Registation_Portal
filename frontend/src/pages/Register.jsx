import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
        <div className="col-12 col-md-8 col-lg-5 col-xl-4">
          <motion.div 
            className="card premium-card border-0 p-4 p-md-5 shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >

            <div className="text-center mb-4">
              <motion.div 
                className="d-inline-flex align-items-center justify-content-center widget-secondary rounded-circle mb-3 shadow-sm" 
                style={{ width: '60px', height: '60px' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <i className="bi bi-person-plus-fill fs-3"></i>
              </motion.div>
              <h3 className="fw-bold text-light mb-1">Create Account</h3>
              <p className="text-muted small">Register to participate in campus events</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="alert alert-danger border-0 rounded-3 small py-2 d-flex align-items-center mb-4 shadow-sm" 
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                <div>{error}</div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="floatingName"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="floatingName">Full Name</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control rounded-3"
                  id="floatingEmail"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="floatingEmail">Email address</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="floatingPass"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPass">Password</label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="floatingConfirmPass"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingConfirmPass">Confirm Password</label>
              </div>

              <motion.button
                type="submit"
                className="btn btn-premium w-100 py-3 rounded-3 fw-bold mb-4 shadow"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                Register
              </motion.button>
            </form>

            <div className="text-center">
              <p className="small text-muted mb-0">
                Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none" style={{color: 'var(--primary-color)'}}>Login Here</Link>
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
