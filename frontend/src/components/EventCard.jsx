import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event }) => {
  const { user, isAdmin } = useAuth();
  
  // Format Date beautifully
  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="card premium-card h-100 border-0">
      <div className="card-img-holder">
        <img 
          src={event.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop"} 
          alt={event.title} 
        />
        <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2 align-items-end">
          {isSoldOut ? (
            <span className="badge bg-danger px-3 py-2 rounded-pill fw-semibold shadow-sm">Sold Out</span>
          ) : (
            <span className="badge bg-success px-3 py-2 rounded-pill fw-semibold shadow-sm">
              {event.availableSeats} Seats Left
            </span>
          )}
          {event.category && (
            <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold shadow-sm">
              {event.category}
            </span>
          )}
        </div>
      </div>
      
      <div className="card-body d-flex flex-column p-4">
        <div className="text-muted small fw-medium mb-2 d-flex align-items-center justify-content-between">
          <span>
            <i className="bi bi-calendar3 me-2 text-primary"></i>
            {formattedDate} at {formattedTime}
          </span>
        </div>
        
        <h5 className="card-title fw-bold text-dark mb-3 line-clamp-2" style={{ minHeight: '3rem' }}>
          {event.title}
        </h5>
        
        <p className="card-text text-secondary mb-4 text-truncate-3" style={{ fontSize: '0.9rem', flex: 1 }}>
          {event.description}
        </p>

        <div className="border-top pt-3 mt-auto">
          <div className="text-secondary small d-flex align-items-center mb-3">
            <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
            <span className="text-truncate">{event.location}</span>
          </div>

          <div className="row g-2">
            <div className="col-6">
              <Link to={`/events/${event.id}`} className="btn btn-outline-primary w-100 py-2 rounded-3 fw-semibold text-truncate">
                View Details
              </Link>
            </div>
            <div className="col-6">
              {isAdmin ? (
                <Link to="/dashboard" className="btn btn-secondary w-100 py-2 rounded-3 fw-semibold text-truncate">
                  Manage
                </Link>
              ) : (
                <Link 
                  to={isSoldOut ? '#' : `/events/${event.id}/register`} 
                  className={`btn btn-premium w-100 py-2 rounded-3 fw-semibold text-truncate ${isSoldOut ? 'disabled' : ''}`}
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
