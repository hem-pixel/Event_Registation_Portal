import React, { useState, useEffect } from 'react';
import feedbackService from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const FeedbackHistory = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      if (user && user.id) {
        const data = await feedbackService.getFeedbackByUser(user.id);
        setFeedbacks(data);
      }
    } catch (err) {
      console.error('Failed to load feedback history', err);
      setError('Failed to load feedback history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-light">My Feedback History</h2>
      
      {error && (
        <div className="alert alert-danger border-0 rounded-3 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
        </div>
      )}
      
      {feedbacks.length === 0 ? (
        <div className="text-center p-5 card premium-card border-0 shadow-sm rounded-4 text-muted">
          <i className="bi bi-chat-right-text fs-1 mb-3"></i>
          <h4>No Feedback Submitted</h4>
          <p>You haven't submitted feedback for any events yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {feedbacks.map(fb => (
            <div className="col-12 col-md-6" key={fb.id}>
              <div className="card premium-card border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between mb-3">
                  <h5 className="fw-bold text-light">{fb.eventName}</h5>
                  <span className="badge widget-primary rounded-pill px-3 py-2">
                    {fb.rating} <i className="bi bi-star-fill text-warning"></i>
                  </span>
                </div>
                <div className="text-muted small mb-3">
                  Submitted on: {new Date(fb.submittedAt).toLocaleDateString()}
                </div>
                <p className="text-light">"{fb.comments || 'No additional comments.'}"</p>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="badge bg-secondary text-light border-0">Quality: {fb.eventQuality}</span>
                  <span className="badge bg-secondary text-light border-0">Speaker: {fb.speakerRating}</span>
                  <span className="badge bg-secondary text-light border-0">Org: {fb.organizationRating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackHistory;
