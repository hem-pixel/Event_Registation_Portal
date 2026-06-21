import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import Loader from '../components/Loader';

const EventRegistration = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');

  useEffect(() => {
    fetchEventDetails();
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
      setCollegeName(user.collegeName || '');
      setDepartment(user.department || '');
      setYear(user.year?.toString() || '1');
    }
  }, [id, user]);

  const isProfileComplete = user?.phoneNumber && user?.collegeName && user?.department && user?.year;

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(id);
      setEvent(data);
      if (data.availableSeats <= 0) {
        setError('This event has sold out.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch event details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phoneNumber || !collegeName || !department || !year) {
      setError('Please fill in all details');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await registrationService.registerForEvent({
        eventId: parseInt(id),
        fullName,
        email,
        phoneNumber,
        collegeName,
        department,
        year: parseInt(year)
      });
      // Redirect to user dashboard after success
      navigate('/dashboard', { state: { successMessage: `Successfully registered for ${event.title}! An confirmation email has been dispatched.` } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. You may have already registered.');
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="card premium-card border-0 shadow-sm p-4 p-md-5">
            
            <div className="mb-4">
              <Link to={`/events/${id}`} className="btn btn-link text-decoration-none p-0 mb-3 text-secondary small">
                <i className="bi bi-arrow-left me-1"></i> Back to Event Details
              </Link>
              <h3 className="fw-extrabold text-dark mb-1">Registration Form</h3>
              <p className="text-muted">Registering for: <span className="fw-semibold text-primary">{event?.title}</span></p>
            </div>

            {error && (
              <div className="alert alert-danger border-0 rounded-3 small py-2 d-flex align-items-center mb-4 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                <div>{error}</div>
              </div>
            )}

            {!isProfileComplete && (
              <div className="alert alert-warning border-0 rounded-3 small py-3 d-flex align-items-center mb-4 shadow-sm" role="alert">
                <i className="bi bi-person-exclamation fs-4 me-3"></i>
                <div>
                  <strong>Incomplete Profile!</strong><br />
                  You must complete your profile details before you can register for events. 
                  <Link to="/profile" className="ms-2 fw-bold text-decoration-underline text-dark">Go to Profile</Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                
                {/* Full Name */}
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      id="regName"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    <label htmlFor="regName">Full Name</label>
                  </div>
                </div>

                {/* Email Address */}
                <div className="col-12 col-md-6">
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control rounded-3"
                      id="regEmail"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="regEmail">Email Address</label>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-12 col-md-6">
                  <div className="form-floating">
                    <input
                      type="tel"
                      className="form-control rounded-3"
                      id="regPhone"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    <label htmlFor="regPhone">Phone Number</label>
                  </div>
                </div>

                {/* College Name */}
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      id="regCollege"
                      placeholder="College Name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      required
                    />
                    <label htmlFor="regCollege">College/Institution Name</label>
                  </div>
                </div>

                {/* Department */}
                <div className="col-12 col-md-8">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      id="regDept"
                      placeholder="Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                    <label htmlFor="regDept">Department/Stream</label>
                  </div>
                </div>

                {/* Year */}
                <div className="col-12 col-md-4">
                  <div className="form-floating">
                    <select
                      className="form-select rounded-3"
                      id="regYear"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                    <label htmlFor="regYear">Study Year</label>
                  </div>
                </div>

              </div>

              <div className="border-top pt-4 mt-4">
                <button
                  type="submit"
                  className="btn btn-premium w-100 py-3 rounded-3 fw-bold shadow-sm"
                  disabled={submitting || event?.availableSeats <= 0 || !isProfileComplete}
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  Submit Registration
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
// Exporting default
