import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import feedbackService from '../services/feedbackService';
import Loader from '../components/Loader';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  // State managers
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');
  const [errorMsg, setErrorMsg] = useState('');

  // USER states
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);

  // ADMIN states
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalUsers: 0,
    presentCount: 0,
    absentCount: 0
  });
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [eventAttendances, setEventAttendances] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, events, attendance
  const [isScanning, setIsScanning] = useState(false);

  // Create Event Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventDay: '',
    duration: '',
    location: '',
    organizer: '',
    availableSeats: 30,
    category: '',
    imageUrl: '',
    registrationDeadline: ''
  });

  // Scanner State
  const [scannedResult, setScannedResult] = useState('');
  const [scanSuccess, setScanSuccess] = useState('');
  const [scanError, setScanError] = useState('');
  const [selectedQrReg, setSelectedQrReg] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchUserData();
    }
  }, [isAdmin]);

  // QR Code Scanner mounting
  useEffect(() => {
    if (isScanning && isAdmin) {
      const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: 250 
      });

      scanner.render((decodedText) => {
        handleQrScanSuccess(decodedText);
        scanner.clear();
        setIsScanning(false); // Close camera on success
      }, (err) => {
        // Silent capture of scanner errors
      });

      return () => {
        scanner.clear().catch(err => console.warn("Failed to clear scanner", err));
      };
    }
  }, [isScanning, isAdmin]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const regs = await registrationService.getMyRegistrations();
      setMyRegistrations(regs);
      const atts = await registrationService.getMyAttendance();
      setMyAttendance(atts);
      
      if (user && user.id) {
        const fbs = await feedbackService.getFeedbackByUser(user.id);
        setMyFeedbacks(fbs);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to sync dashboard information.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const metrics = await registrationService.getDashboardStats();
      setStats(metrics);
      const evs = await eventService.getAllEvents();
      setAllEvents(evs);
      if (evs.length > 0) {
        setSelectedEventId('ALL');
        fetchEventRegistrations('ALL');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load portal statistics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventRegistrations = async (eventId) => {
    try {
      if (eventId === "ALL") {
        const data = await registrationService.getAllRegistrations();
        setEventRegistrations(data);
        const attData = await registrationService.getAllAttendance();
        setEventAttendances(attData);
      } else {
        const data = await registrationService.getRegistrationsForEvent(eventId);
        setEventRegistrations(data);
        const attData = await registrationService.getAttendanceForEvent(eventId);
        setEventAttendances(attData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventSelect = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    if (eventId) {
      fetchEventRegistrations(eventId);
    } else {
      setEventRegistrations([]);
    }
  };

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await eventService.updateEvent(editEventId, eventForm);
        setSuccessMsg('Event updated successfully!');
      } else {
        await eventService.createEvent(eventForm);
        setSuccessMsg('Event created successfully!');
      }
      setIsEditing(false);
      setEditEventId(null);
      setEventForm({
        title: '',
        description: '',
        eventDate: '',
        eventDay: '',
        duration: '',
        location: '',
        organizer: '',
        availableSeats: 30,
        category: '',
        imageUrl: '',
        registrationDeadline: ''
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save event information.');
    }
  };

  const handleEditClick = (event) => {
    setIsEditing(true);
    setEditEventId(event.id);
    
    // Format date for datetime-local input
    const formattedDate = event.eventDate ? event.eventDate.substring(0, 16) : '';
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      eventDate: formattedDate,
      eventDay: event.eventDay || '',
      duration: event.duration || '',
      location: event.location || '',
      organizer: event.organizer || '',
      availableSeats: event.availableSeats || 0,
      category: event.category || '',
      imageUrl: event.imageUrl || '',
      registrationDeadline: event.registrationDeadline || ''
    });
    // Scroll to form or switch focus
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to permanently delete this event? All related registrations will be lost.')) {
      try {
        await eventService.deleteEvent(eventId);
        setSuccessMsg('Event deleted successfully.');
        fetchAdminData();
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to delete event.');
      }
    }
  };

  const handleCheckIn = async (registrationId) => {
    try {
      await registrationService.markAttendance(registrationId);
      setSuccessMsg('Attendance marked PRESENT successfully!');
      if (selectedEventId) {
        fetchEventRegistrations(selectedEventId);
      }
      const metrics = await registrationService.getDashboardStats();
      setStats(metrics);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update attendance.');
    }
  };

  const handleExcelExport = async () => {
    if (!selectedEventId || selectedEventId === 'ALL') {
      setErrorMsg('Please select a specific event to export (not All Events).');
      return;
    }
    const currentEvent = allEvents.find(e => e.id.toString() === selectedEventId.toString());
    if (!currentEvent) return;

    try {
      await registrationService.exportRegistrationsToExcel(currentEvent.id, currentEvent.title);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to export registrations.');
    }
  };

  const handleExportAllAttendance = async () => {
    try {
      setSuccessMsg('Preparing full attendance report...');
      await registrationService.exportAllAttendanceToExcel();
      setSuccessMsg('All attendance report downloaded successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to export full attendance report.');
    }
  };

  // Mark Attendance via QR Scanned Result
  const handleQrScanSuccess = async (decodedText) => {
    setScannedResult(decodedText);
    setScanSuccess('');
    setScanError('');

    let regId = null;

    // Check for plain text format
    if (decodedText.startsWith("REGISTRATION_ID:")) {
      regId = decodedText.split(":")[1];
    } else {
      // Check for JSON format (Backend email QR uses this)
      try {
        const parsed = JSON.parse(decodedText);
        if (parsed.registrationId) {
          regId = parsed.registrationId;
        }
      } catch (e) {
        // Ignore JSON parse error
      }
    }

    if (regId) {
      try {
        await registrationService.markAttendance(regId);
        setScanSuccess(`SUCCESS: Attendance marked PRESENT for Registration ID: ${regId}`);
        // refresh data
        if (selectedEventId) {
          fetchEventRegistrations(selectedEventId);
        }
        const metrics = await registrationService.getDashboardStats();
        setStats(metrics);
      } catch (err) {
        console.error(err);
        setScanError(err.response?.data?.message || `Failed to mark attendance for ID ${regId}.`);
      }
    } else {
      setScanError("INVALID CODE FORMAT: QR Code is not a valid EventPortal registration.");
    }
  };

  const handleManualCheckInInput = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const regId = fd.get('manualRegId');
    if (regId) {
      handleQrScanSuccess(`REGISTRATION_ID:${regId}`);
      e.target.reset();
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div 
      className="container py-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
      {/* Alert Banners */}
      {successMsg && (
        <div className="alert alert-success border-0 rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-3 fs-4 text-success"></i>
            <div>{successMsg}</div>
          </div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger border-0 rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-octagon-fill me-3 fs-4 text-danger"></i>
            <div>{errorMsg}</div>
          </div>
          <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      {/* Title Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
            {isAdmin ? 'ADMINISTRATOR AREA' : 'STUDENT CONSOLE'}
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Hello, {user.name}!</h2>
          <p className="text-secondary mb-0">{user.email}</p>
        </div>
        {!isAdmin && (
          <Link to="/events" className="btn btn-premium rounded-pill px-4 py-2">
            <i className="bi bi-calendar-event me-2"></i> Register for Events
          </Link>
        )}
      </div>

      {/* ======================================================== */}
      {/* STUDENT DASHBOARD PANEL */}
      {/* ======================================================== */}
      {!isAdmin && (
        <div className="row g-4">
          
          {/* Quick Metrics */}
          <div className="col-12 col-md-6">
            <div className="widget-card d-flex align-items-center gap-4">
              <div className="widget-icon widget-primary">
                <i className="bi bi-clipboard2-check-fill"></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">{myRegistrations.length}</h4>
                <p className="text-secondary small mb-0">Registered Events</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="widget-card d-flex align-items-center gap-4">
              <div className="widget-icon widget-success">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">
                  {myAttendance.filter(a => a.attendanceStatus === 'PRESENT').length} / {myRegistrations.length}
                </h4>
                <p className="text-secondary small mb-0">Check-In Attendance</p>
              </div>
            </div>
          </div>

          {/* Registrations List */}
          <div className="col-12 mt-5">
            <h4 className="fw-bold text-dark mb-4">My Registered Events</h4>
            {myRegistrations.length === 0 ? (
              <div className="card premium-card border-0 p-5 text-center text-muted">
                <i className="bi bi-calendar2-x fs-1 mb-3"></i>
                <h5>No Registrations Found</h5>
                <p className="small mb-0">You have not registered for any events yet. Head over to the Events Catalog to find options.</p>
              </div>
            ) : (
              <div className="row g-4">
                {myRegistrations.map((reg) => {
                  const attendRecord = myAttendance.find(a => a.registration.id === reg.id);
                  const isPresent = attendRecord?.attendanceStatus === 'PRESENT';
                  const hasSubmittedFeedback = myFeedbacks.some(fb => fb.eventId.toString() === reg.event.id.toString());
                  const eventDate = new Date(reg.event.eventDate);

                  return (
                    <div className="col-12" key={reg.id}>
                      <div className="card premium-card border-0 p-4">
                        <div className="row align-items-center g-3">
                          
                          {/* Event info */}
                          <div className="col-12 col-md-5">
                            <h5 className="fw-bold text-dark mb-2">{reg.event.title}</h5>
                            <div className="text-secondary small mb-1">
                              <i className="bi bi-calendar3 me-2 text-primary"></i>
                              {eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-secondary small mb-3 mb-md-0">
                              <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                              {reg.event.location}
                            </div>
                          </div>

                          {/* Detail fields */}
                          <div className="col-6 col-md-3">
                            <div className="small text-muted">Registrant Details</div>
                            <div className="fw-semibold text-dark mb-1">{reg.fullName}</div>
                            <small className="text-muted d-block">{reg.collegeName}</small>
                            <small className="text-muted d-block">{reg.department} ({reg.year} Yr)</small>
                          </div>

                          {/* Attendance Status */}
                          <div className="col-6 col-md-2 text-center text-md-start">
                            <div className="small text-muted mb-1">Attendance</div>
                            {isPresent ? (
                              <span className="badge bg-success px-3 py-2 rounded-pill fw-bold">
                                <i className="bi bi-check-circle-fill me-1"></i> Checked-In
                              </span>
                            ) : (
                              <span className="badge bg-secondary px-3 py-2 rounded-pill fw-medium">
                                <i className="bi bi-hourglass-split me-1"></i> Unchecked
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="col-12 col-md-2 text-center text-md-end">
                            {isPresent ? (
                              hasSubmittedFeedback ? (
                                <span className="badge widget-primary text-primary px-3 py-2 rounded-pill fw-bold">
                                  <i className="bi bi-check-circle-fill me-1"></i> Feedback Submitted
                                </span>
                              ) : (
                                <Link
                                  to={`/event/${reg.event.id}/feedback`}
                                  className="btn btn-primary rounded-3 btn-sm px-3 py-2 fw-semibold"
                                >
                                  <i className="bi bi-star-fill me-2 text-warning"></i> Provide Feedback
                                </Link>
                              )
                            ) : (
                              <button
                                type="button"
                                className="btn btn-outline-primary rounded-3 btn-sm px-3 py-2 fw-semibold"
                                data-bs-toggle="modal"
                                data-bs-target="#globalQrModal"
                                onClick={() => setSelectedQrReg(reg)}
                              >
                                <i className="bi bi-qr-code me-2"></i> Show QR Code
                              </button>
                            )}
                          </div>


                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* ADMINISTRATOR DASHBOARD PANEL */}
      {/* ======================================================== */}
      {isAdmin && (
        <div>
          {/* Admin Navigation Tabs */}
          <ul className="nav nav-pills mb-4 gap-2 bg-white p-2 rounded-4 shadow-sm border" style={{ width: 'fit-content' }}>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-3 fw-semibold px-4 ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-grid-fill me-2"></i> Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-3 fw-semibold px-4 ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                <i className="bi bi-calendar-event-fill me-2"></i> Manage Events
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-3 fw-semibold px-4 ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                <i className="bi bi-person-check-fill me-2"></i> Attendance
              </button>
            </li>
          </ul>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="row g-4">
              
              {/* Analytics Counters */}
              <div className="col-12 col-md-4">
                <div className="widget-card d-flex align-items-center gap-4">
                  <div className="widget-icon widget-primary">
                    <i className="bi bi-calendar-date-fill"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold text-dark mb-1">{stats.totalEvents}</h4>
                    <p className="text-secondary small mb-0">Total Events Hosted</p>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-4">
                <div className="widget-card d-flex align-items-center gap-4">
                  <div className="widget-icon widget-secondary">
                    <i className="bi bi-person-hearts"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold text-dark mb-1">{stats.totalRegistrations}</h4>
                    <p className="text-secondary small mb-0">Total Registrations</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="widget-card d-flex align-items-center gap-4">
                  <div className="widget-icon widget-success">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold text-dark mb-1">{stats.totalUsers}</h4>
                    <p className="text-secondary small mb-0">Registered Student Accounts</p>
                  </div>
                </div>
              </div>

              {/* Attendance Ratio Card */}
              <div className="col-12">
                <div className="card premium-card border-0 p-4 p-md-5">
                  <h4 className="fw-bold mb-4 text-dark">Overall Attendance Analytics</h4>
                  
                  {stats.totalRegistrations === 0 ? (
                    <div className="text-center py-4 text-secondary">No registrations recorded to compute stats.</div>
                  ) : (
                    <div>
                      <div className="row align-items-center mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <h6 className="text-muted fw-bold">Student Check-In Progress</h6>
                          <div className="d-flex align-items-baseline gap-2">
                            <span className="display-4 fw-extrabold text-primary">{stats.presentCount}</span>
                            <span className="text-muted">students checked in</span>
                          </div>
                          <p className="text-secondary small">Out of {stats.totalRegistrations} total event registration allocations.</p>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex flex-column gap-3">
                            <div>
                              <div className="d-flex justify-content-between small mb-1 fw-bold text-success">
                                <span>Checked-In (PRESENT)</span>
                                <span>{Math.round((stats.presentCount / stats.totalRegistrations) * 100)}%</span>
                              </div>
                              <div className="progress rounded-pill" style={{ height: '10px' }}>
                                <div className="progress-bar bg-success" role="progressbar" style={{ width: `${(stats.presentCount / stats.totalRegistrations) * 100}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="d-flex justify-content-between small mb-1 fw-bold text-secondary">
                                <span>Unchecked (ABSENT)</span>
                                <span>{Math.round((stats.absentCount / stats.totalRegistrations) * 100)}%</span>
                              </div>
                              <div className="progress rounded-pill" style={{ height: '10px' }}>
                                <div className="progress-bar bg-secondary" role="progressbar" style={{ width: `${(stats.absentCount / stats.totalRegistrations) * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE EVENTS (CRUD) */}
          {activeTab === 'events' && (
            <div className="row g-4">
              
              {/* Event Editor Form */}
              <div className="col-12 col-lg-5">
                <div className="card premium-card border-0 p-4 shadow-sm">
                  <h4 className="fw-bold mb-4 text-dark">{isEditing ? 'Edit Event Details' : 'Create New Event'}</h4>
                  <form onSubmit={handleSaveEvent}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-bold">Event Title</label>
                        <input type="text" className="form-control rounded-3" name="title" value={eventForm.title} onChange={handleEventFormChange} required />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Description</label>
                        <textarea className="form-control rounded-3" name="description" rows="3" value={eventForm.description} onChange={handleEventFormChange} required></textarea>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Date & Time</label>
                        <input type="datetime-local" className="form-control rounded-3" name="eventDate" value={eventForm.eventDate} onChange={handleEventFormChange} required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Event Day</label>
                        <input type="text" className="form-control rounded-3" name="eventDay" placeholder="e.g. Wednesday" value={eventForm.eventDay} onChange={handleEventFormChange} />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Duration</label>
                        <input type="text" className="form-control rounded-3" name="duration" placeholder="e.g. 3 Hours" value={eventForm.duration} onChange={handleEventFormChange} required />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Venue Location</label>
                        <input type="text" className="form-control rounded-3" name="location" value={eventForm.location} onChange={handleEventFormChange} required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Organizer</label>
                        <input type="text" className="form-control rounded-3" name="organizer" value={eventForm.organizer} onChange={handleEventFormChange} />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Capacity (Seats)</label>
                        <input type="number" className="form-control rounded-3" name="availableSeats" value={eventForm.availableSeats} onChange={handleEventFormChange} required min="1" />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Category</label>
                        <input type="text" className="form-control rounded-3" name="category" placeholder="e.g. Hackathon" value={eventForm.category} onChange={handleEventFormChange} />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Registration Deadline</label>
                        <input type="date" className="form-control rounded-3" name="registrationDeadline" value={eventForm.registrationDeadline} onChange={handleEventFormChange} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Image URL</label>
                        <input type="url" className="form-control rounded-3" name="imageUrl" placeholder="Unsplash image URL or blank" value={eventForm.imageUrl} onChange={handleEventFormChange} />
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2 mt-4 border-top pt-3">
                      <button type="submit" className="btn btn-premium flex-grow-1 py-2">
                        {isEditing ? 'Save Changes' : 'Create Event'}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          className="btn btn-light border py-2"
                          onClick={() => {
                            setIsEditing(false);
                            setEditEventId(null);
                            setEventForm({ title:'', description:'', eventDate:'', eventDay:'', duration:'', location:'', organizer:'', availableSeats:30, category:'', imageUrl:'', registrationDeadline:'' });
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Existing Events List */}
              <div className="col-12 col-lg-7">
                <div className="card premium-card border-0 p-4 shadow-sm">
                  <h4 className="fw-bold mb-4 text-dark">Active Events Catalog</h4>
                  
                  {allEvents.length === 0 ? (
                    <div className="text-center py-5 text-secondary">No events hosted yet. Fill the editor to add one.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle border-0">
                        <thead className="table-light">
                          <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Seats Capacity</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allEvents.map(ev => (
                            <tr key={ev.id}>
                              <td className="fw-semibold text-dark">{ev.title}</td>
                              <td className="small text-muted">{new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                              <td>{ev.availableSeats} available</td>
                              <td className="text-end">
                                <div className="btn-group gap-1">
                                  <button className="btn btn-outline-secondary btn-sm rounded-2" onClick={() => handleEditClick(ev)}>
                                    <i className="bi bi-pencil-square"></i>
                                  </button>
                                  <button className="btn btn-outline-danger btn-sm rounded-2" onClick={() => handleDeleteEvent(ev.id)}>
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="card premium-card border-0 p-4 p-md-5 shadow-sm">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div className="d-flex flex-row align-items-center gap-3 w-100 max-width-md">
                  <label className="fw-bold text-dark mb-0 text-nowrap">Filter by Event:</label>
                  <select className="form-select rounded-3" value={selectedEventId} onChange={handleEventSelect}>
                    <option value="">-- Choose Event --</option>
                    <option value="ALL">-- ALL EVENTS --</option>
                    {allEvents.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>
                {selectedEventId && eventRegistrations.length > 0 && (
                  <button className="btn btn-primary fw-bold rounded-3 px-4 py-2" onClick={() => setIsScanning(true)}>
                    <i className="bi bi-qr-code-scan me-2"></i> Scan QR
                  </button>
                )}

                {/* Download All Attendance Button — always visible for admin */}
                <motion.button
                  className="btn btn-premium fw-bold rounded-3 px-4 py-2 d-flex align-items-center gap-2"
                  onClick={handleExportAllAttendance}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  title="Download full attendance report across ALL events"
                >
                  <i className="bi bi-cloud-arrow-down-fill fs-5"></i>
                  <span>Download All Attendance</span>
                </motion.button>
              </div>

              {scanSuccess && (
                <div className="alert alert-success border-0 rounded-3 small py-3 d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-patch-check-fill me-2 fs-4 text-success"></i>
                  <div className="fs-6 fw-semibold">{scanSuccess}</div>
                </div>
              )}

              {scanError && (
                <div className="alert alert-danger border-0 rounded-3 small py-3 d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-x-circle-fill me-2 fs-4 text-danger"></i>
                  <div className="fs-6 fw-semibold">{scanError}</div>
                </div>
              )}

              {selectedEventId === '' ? (
                <div className="text-center py-5 text-secondary">Please select an event above to inspect registrations.</div>
              ) : eventRegistrations.length === 0 ? (
                <div className="text-center py-5 text-secondary">No registrations have been logged for this event.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle border-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Event</th>
                        <th>Name</th>
                        <th>College Info</th>
                        <th>Phone</th>
                        <th>Registration Date</th>
                        <th>Check-in Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventRegistrations.map((reg) => (
                        <tr key={reg.id}>
                          <td className="small text-muted">{reg.id}</td>
                          <td>
                            <div className="fw-bold text-primary">{reg.event?.title || 'Unknown Event'}</div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{reg.fullName}</div>
                            <small className="text-muted text-break">{reg.email}</small>
                          </td>
                          <td>
                            <div className="small text-dark">{reg.collegeName}</div>
                            <small className="text-muted">{reg.department} ({reg.year} Yr)</small>
                          </td>
                          <td className="small">{reg.phoneNumber}</td>
                          <td className="small text-muted">{new Date(reg.registrationDate).toLocaleDateString()}</td>
                          <td>
                            {reg.status === 'CANCELLED' ? (
                              <span className="badge bg-danger">Cancelled</span>
                            ) : (
                              eventAttendances.find(a => a.registration.id === reg.id && a.attendanceStatus === 'PRESENT') ? (
                                <span className="badge bg-success px-3 py-2 rounded-pill fw-bold"><i className="bi bi-check-circle-fill me-1"></i> PRESENT</span>
                              ) : (
                                <span className="badge bg-secondary px-3 py-2 rounded-pill fw-medium"><i className="bi bi-hourglass-split me-1"></i> ABSENT</span>
                              )
                            )}
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-primary btn-sm rounded-pill px-3"
                              onClick={() => handleCheckIn(reg.id)}
                            >
                              <i className="bi bi-check-lg me-1"></i> Check In
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Global QR Code Modal */}
      {createPortal(
        <div className="modal fade" id="globalQrModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '350px' }}>
            <div className="modal-content border-0 rounded-4 p-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Scan for Check-in</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body text-center py-4">
                  {selectedQrReg && (
                    <>
                      <div className="bg-white p-4 rounded-4 d-inline-block border shadow-sm mb-3">
                        <QRCodeSVG 
                          id={`qr-canvas-${selectedQrReg.id}`}
                          value={JSON.stringify({
                            registrationId: selectedQrReg.id,
                            eventId: selectedQrReg.event.id,
                            eventName: selectedQrReg.event.title
                          })} 
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{selectedQrReg.event.title}</h6>
                      <p className="text-muted small mb-0">Reg ID: {selectedQrReg.id}</p>
                      <div className="mt-4">
                        <button 
                          className="btn btn-outline-primary rounded-pill px-4"
                          onClick={() => {
                            const svg = document.getElementById(`qr-canvas-${selectedQrReg.id}`);
                            if (!svg) return;
                            const svgData = new XMLSerializer().serializeToString(svg);
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d");
                            const img = new Image();
                            img.onload = () => {
                              canvas.width = img.width;
                              canvas.height = img.height;
                              ctx.drawImage(img, 0, 0);
                              const pngFile = canvas.toDataURL("image/png");
                              const link = document.createElement("a");
                              link.download = `QR_${selectedQrReg.event.title.replace(/\\s+/g, '_')}.png`;
                              link.href = pngFile;
                              link.click();
                            };
                            img.src = "data:image/svg+xml;base64," + btoa(svgData);
                          }}
                        >
                          <i className="bi bi-download me-2"></i> Download QR
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>,
        document.body
      )}

      {/* Camera Scanner Modal */}
      {isScanning && createPortal(
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Scan QR Code</h5>
                <button type="button" className="btn-close" onClick={() => setIsScanning(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body py-4">
                <p className="text-secondary small mb-3 text-center">
                  Point the camera at the student's QR code.
                </p>
                <div className="mx-auto border rounded-4 bg-light overflow-hidden shadow-sm mb-3" style={{ maxWidth: '400px' }}>
                  <div id="reader" style={{ width: '100%' }}></div>
                </div>
                
                {/* Manual fallback input */}
                <div className="border-top pt-4 text-start px-3">
                  <h6 className="fw-bold text-dark mb-2">Check-in Manually:</h6>
                  <form onSubmit={(e) => {
                    handleManualCheckInInput(e);
                    setIsScanning(false);
                  }} className="row g-2">
                    <div className="col-8">
                      <input
                        type="number"
                        className="form-control rounded-3"
                        name="manualRegId"
                        placeholder="Registration ID..."
                        required
                      />
                    </div>
                    <div className="col-4">
                      <button type="submit" className="btn btn-primary w-100 rounded-3 fw-semibold">
                        Check-In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      
    </motion.div>
  );
};

export default Dashboard;
// Exporting default
