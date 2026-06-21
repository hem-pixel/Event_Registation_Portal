import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the path the user was redirected from (default to dashboard)
  const fromPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="col-12 col-md-8 col-lg-5 col-xl-4">
          <motion.div 
            className="card premium-card border-0 p-4 p-md-5 shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            
            <div className="text-center mb-4">
              <motion.div 
                className="d-inline-flex align-items-center justify-content-center widget-primary rounded-circle mb-3 shadow-sm" 
                style={{ width: '60px', height: '60px' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <i className="bi bi-shield-lock-fill fs-3"></i>
              </motion.div>
              <h3 className="fw-bold text-light mb-1">Welcome Back</h3>
              <p className="text-muted small">Please sign in to access your portal</p>
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
                  type="email"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>

              <div className="mb-4 position-relative">
                <div className="form-floating">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control rounded-3 pe-5"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-1 border-0 bg-transparent text-muted"
                  style={{ zIndex: 10 }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <motion.i
                    key={showPassword ? 'eye-slash' : 'eye'}
                    className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} fs-5`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                </button>
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
                Login
              </motion.button>
            </form>

            <div className="text-center">
              <p className="small text-muted mb-0">
                Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none" style={{color: 'var(--primary-color)'}}>Register Here</Link>
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
