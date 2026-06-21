import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import eventService from '../services/eventService';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err) {
      console.error(err);
      setError('Event not found or failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error || !event) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger max-width-md mx-auto p-4 rounded-4 shadow-sm" role="alert">
          <i className="bi bi-x-circle-fill fs-2 mb-3 text-danger d-block"></i>
          <h4>Error</h4>
          <p className="mb-0">{error || 'Event not found'}</p>
          <Link to="/events" className="btn btn-primary mt-3 px-4 rounded-pill">Back to Events</Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  
  // Format Date, Day, Time
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
  
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row g-4">
        {/* Main Column */}
        <div className="col-12 col-lg-8">
          <div className="card premium-card border-0 shadow-sm mb-4">
            <div className="card-img-holder" style={{ height: '350px' }}>
              <img 
                src={event.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop"} 
                alt={event.title} 
                className="w-100 h-100 object-fit-cover"
              />
            </div>
            <div className="card-body p-4 p-md-5">
              <h2 className="fw-extrabold text-dark mb-4">{event.title}</h2>
              
              <h4 className="fw-bold mb-3">About the Event</h4>
              <p className="text-secondary lh-lg mb-0" style={{ whiteSpace: 'pre-line' }}>
                {event.description}
              </p>
              
              {event.category && (
                <div className="mt-4">
                  <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold shadow-sm fs-6">
                    Category: {event.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Sidebar Column */}
        <div className="col-12 col-lg-4">
          <div className="card premium-card border-0 shadow-sm p-4 sticky-lg-top" style={{ top: '90px' }}>
            <h4 className="fw-bold text-dark mb-4">Event Details</h4>

            {/* Logistics Widget List */}
            <div className="d-flex flex-column gap-4 mb-4">
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 bg-primary-subtle text-primary rounded-3 p-3 me-3">
                  <i className="bi bi-calendar-check fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Date & Day</h6>
                  <p className="text-muted small mb-0">{formattedDate}</p>
                  <small className="text-primary fw-semibold">{event.eventDay || formattedDay}</small>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 bg-secondary-subtle text-secondary rounded-3 p-3 me-3">
                  <i className="bi bi-clock-history fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Time & Duration</h6>
                  <p className="text-muted small mb-0">{formattedTime}</p>
                  <small className="text-secondary fw-semibold">Duration: {event.duration}</small>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 bg-danger-subtle text-danger rounded-3 p-3 me-3">
                  <i className="bi bi-geo-alt-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Venue Location</h6>
                  <p className="text-muted small mb-0">{event.location}</p>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 bg-success-subtle text-success rounded-3 p-3 me-3">
                  <i className="bi bi-person-badge fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Organized By</h6>
                  <p className="text-muted small mb-0">{event.organizer || 'College Management'}</p>
                </div>
              </div>
            </div>

            <div className="border-top pt-4 text-center">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="text-muted small fw-medium">Available Seats</span>
                {isSoldOut ? (
                  <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill">Sold Out</span>
                ) : (
                  <span className="badge bg-success fs-6 px-3 py-2 rounded-pill fw-bold">{event.availableSeats} Remaining</span>
                )}
              </div>
              {event.registrationDeadline && (
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-muted small fw-medium">Registration Deadline</span>
                  <span className="text-danger small fw-bold">
                    {new Date(event.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}

              {isAdmin ? (
                <div className="gap-2 d-flex flex-column">
                  <Link to="/dashboard" className="btn btn-secondary w-100 py-3 rounded-3 fw-bold">
                    Go to Admin Dashboard
                  </Link>
                  <Link to="/events" className="btn btn-link text-decoration-none">
                    Back to Events
                  </Link>
                </div>
              ) : (
                <div className="gap-2 d-flex flex-column">
                  <Link 
                    to={isSoldOut ? '#' : `/events/${event.id}/register`} 
                    className={`btn btn-premium w-100 py-3 rounded-3 fw-bold shadow-sm ${isSoldOut ? 'disabled' : ''}`}
                  >
                    {isSoldOut ? 'No Slots Left' : 'Register Now'}
                  </Link>
                  <Link to="/events" className="btn btn-link text-decoration-none">
                    Back to Events
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
// Exporting default
