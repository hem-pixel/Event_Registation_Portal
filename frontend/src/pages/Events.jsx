import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row mb-5">
        <div className="col-12 col-md-8 mx-auto text-center">
          <h1 className="fw-extrabold text-dark display-5 mb-3">Discover Exciting Events</h1>
          <p className="lead text-secondary">
            Register and participate in workshops, seminars, and competitive hackathons happening in your campus.
          </p>
          
          <div className="input-group mt-4 shadow-sm rounded-4 overflow-hidden border">
            <span className="input-group-text bg-white border-0 ps-3">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 py-3 ps-2"
              placeholder="Search by event title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader fullPage={false} />
      ) : error ? (
        <div className="alert alert-danger text-center p-4 rounded-4 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-2 text-danger mb-3 d-block"></i>
          <p className="fw-semibold mb-0">{error}</p>
        </div>
      ) : (
        <>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
              <h4 className="fw-bold text-dark">No Events Found</h4>
              <p className="text-muted">Try adjusting your search criteria or explore again later.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredEvents.map(event => (
                <div className="col" key={event.id}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;
