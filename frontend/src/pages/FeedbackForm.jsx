import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import feedbackService from '../services/feedbackService';
import eventService from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const FeedbackForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  
  const [form, setForm] = useState({
    rating: 0,
    eventQuality: '',
    speakerRating: '',
    organizationRating: '',
    recommendation: '',
    comments: ''
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetchEventAndFeedbackDetails();
  }, [eventId, user]);

  const fetchEventAndFeedbackDetails = async () => {
    try {
      const data = await eventService.getEventById(eventId);
      setEventData(data);
      
      if (user && user.id) {
        const userFeedbacks = await feedbackService.getFeedbackByUser(user.id);
        const hasSubmitted = userFeedbacks.some(fb => fb.eventId.toString() === eventId.toString());
        if (hasSubmitted) {
          setAlreadySubmitted(true);
        }
      }
    } catch (err) {
      setErrorMsg('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) {
      setErrorMsg('Please select a star rating.');
      return;
    }
    if (!form.eventQuality || !form.speakerRating || !form.organizationRating || !form.recommendation) {
      setErrorMsg('Please answer all the required questions.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await feedbackService.submitFeedback({ ...form, eventId: parseInt(eventId, 10) });
      setSuccessMsg('Thank you for your feedback! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit feedback.');
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (alreadySubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-5 text-center"
      >
        <div className="card premium-card border-0 p-5 shadow-lg rounded-4 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          <h3 className="fw-bold text-light mt-4">Feedback Already Submitted</h3>
          <p className="text-muted mt-2">You have already provided feedback for <strong>{eventData?.title}</strong>. Thank you!</p>
          <button className="btn btn-outline-premium mt-4" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-5"
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card premium-card border-0 p-4 shadow-lg rounded-4">
            <h3 className="fw-extrabold text-light mb-2 text-center">Event Feedback</h3>
            <p className="text-muted text-center mb-4">We value your feedback for <span className="fw-bold">{eventData?.title}</span></p>

            {errorMsg && (
              <div className="alert alert-danger rounded-3 small py-2">{errorMsg}</div>
            )}

            {successMsg && (
              <div className="alert alert-success rounded-3 small py-2 d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2"></i>{successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              <div className="mb-4 text-center">
                <label className="form-label fw-bold d-block mb-3 text-light">Overall Rating <span className="text-danger">*</span></label>
                <div className="d-flex justify-content-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.i 
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      className={`bi ${star <= (hoveredStar || form.rating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} fs-1 cursor-pointer`}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                      style={{ cursor: 'pointer' }}
                    ></motion.i>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold text-light">1. How was the event quality? <span className="text-danger">*</span></label>
                <select className="form-select rounded-3" name="eventQuality" value={form.eventQuality} onChange={handleOptionChange}>
                  <option value="">Select option...</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold text-light">2. How was the speaker/session? <span className="text-danger">*</span></label>
                <select className="form-select rounded-3" name="speakerRating" value={form.speakerRating} onChange={handleOptionChange}>
                  <option value="">Select option...</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold text-light">3. How was the event organization? <span className="text-danger">*</span></label>
                <select className="form-select rounded-3" name="organizationRating" value={form.organizationRating} onChange={handleOptionChange}>
                  <option value="">Select option...</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold text-light">4. Would you recommend this event? <span className="text-danger">*</span></label>
                <select className="form-select rounded-3" name="recommendation" value={form.recommendation} onChange={handleOptionChange}>
                  <option value="">Select option...</option>
                  <option value="Yes">Yes</option>
                  <option value="Maybe">Maybe</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold text-light">Additional Comments / Suggestions</label>
                <textarea 
                  className="form-control rounded-3" 
                  rows="4" 
                  name="comments" 
                  value={form.comments} 
                  onChange={handleOptionChange}
                  placeholder="Tell us what you liked or how we can improve..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-premium w-100 rounded-pill py-2 fw-bold" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;
