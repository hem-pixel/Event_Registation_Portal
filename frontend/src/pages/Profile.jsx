import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: user?.phoneNumber || '',
    collegeName: user?.collegeName || '',
    department: user?.department || '',
    year: user?.year || ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync formData when user updates (e.g. after successful save)
  useEffect(() => {
    if (user) {
      setFormData({
        phoneNumber: user.phoneNumber || '',
        collegeName: user.collegeName || '',
        department: user.department || '',
        year: user.year || ''
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSuccessMsg('Profile updated successfully!');
      setErrorMsg('');
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
      setSuccessMsg('');
    }
  };

  const isProfileComplete = user.phoneNumber && user.collegeName && user.department && user.year;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card premium-card border-0 p-4 p-md-5 text-center shadow-sm">
            
            <div className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-4 shadow-sm fw-bold" style={{ width: '80px', height: '80px', fontSize: '2.2rem', background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <h3 className="fw-bold text-dark mb-1">{user.name}</h3>
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">
              {user.role === 'ROLE_ADMIN' ? 'Portal Administrator' : 'Student Account'}
            </span>
            
            {!isProfileComplete && user.role !== 'ROLE_ADMIN' && (
              <div className="alert alert-warning small py-2 mt-3 text-start">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Please complete your profile to register for events.
              </div>
            )}

            {errorMsg && <div className="alert alert-danger small py-2 mt-3">{errorMsg}</div>}
            {successMsg && <div className="alert alert-success small py-2 mt-3">{successMsg}</div>}

            <div className="text-start border-top pt-4 mb-4 mt-3">
              <div className="mb-3">
                <label className="text-muted small d-block">Email Address</label>
                <span className="fw-semibold text-dark fs-5">{user.email}</span>
              </div>
              
              {!isEditing ? (
                <>
                  <div className="mb-3">
                    <label className="text-muted small d-block">Phone Number</label>
                    <span className="fw-semibold text-dark">{user.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small d-block">College Name</label>
                    <span className="fw-semibold text-dark">{user.collegeName || 'Not provided'}</span>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small d-block">Department</label>
                    <span className="fw-semibold text-dark">{user.department || 'Not provided'}</span>
                  </div>
                  <div className="mb-4">
                    <label className="text-muted small d-block">Year</label>
                    <span className="fw-semibold text-dark">{user.year ? `${user.year} Yr` : 'Not provided'}</span>
                  </div>
                  
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="btn btn-outline-primary w-100 py-2 rounded-3 fw-semibold mb-2"
                  >
                    Edit Profile Details
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="text-start mt-3">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Phone Number</label>
                    <input type="tel" className="form-control rounded-3" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">College Name</label>
                    <input type="text" className="form-control rounded-3" name="collegeName" value={formData.collegeName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Department</label>
                    <input type="text" className="form-control rounded-3" name="department" value={formData.department} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold">Year</label>
                    <select className="form-select rounded-3" name="year" value={formData.year} onChange={handleChange} required>
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-premium flex-grow-1 py-2 rounded-3 fw-semibold">Save Details</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-light border py-2 rounded-3 fw-semibold">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            <div className="gap-2 d-flex flex-column border-top pt-4">
              <Link to="/dashboard" className="btn btn-premium w-100 py-2 rounded-3 fw-semibold">
                Go to Dashboard
              </Link>
              <Link to="/events" className="btn btn-outline-secondary w-100 py-2 rounded-3 fw-semibold">
                Browse Events
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
