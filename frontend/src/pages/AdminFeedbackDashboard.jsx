import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import eventService from '../services/eventService';
import feedbackService from '../services/feedbackService';
import Loader from '../components/Loader';

const AdminFeedbackDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
      setSelectedEventId('ALL');
      fetchAllFeedback();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchFeedbackForEvent = async (eventId) => {
    setLoading(true);
    try {
      const data = await feedbackService.getFeedbackByEvent(eventId);
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFeedback = async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getAllFeedback();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    if (eventId === 'ALL') {
      fetchAllFeedback();
    } else if (eventId) {
      fetchFeedbackForEvent(eventId);
    } else {
      setFeedbacks([]);
    }
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const eventBreakdown = { 5: {}, 4: {}, 3: {}, 2: {}, 1: {} };
    feedbacks.forEach(f => {
      dist[f.rating]++;
      if (!eventBreakdown[f.rating][f.eventName]) {
        eventBreakdown[f.rating][f.eventName] = 0;
      }
      eventBreakdown[f.rating][f.eventName]++;
    });
    return Object.keys(dist).map(key => ({
      name: `${key} Stars`,
      value: dist[key],
      breakdown: eventBreakdown[key]
    })).reverse();
  };

  const getQualityData = () => {
    const dist = { Excellent: 0, Good: 0, Average: 0, Poor: 0 };
    const eventBreakdown = { Excellent: {}, Good: {}, Average: {}, Poor: {} };
    feedbacks.forEach(f => {
      if (dist[f.eventQuality] !== undefined) {
        dist[f.eventQuality]++;
        if (!eventBreakdown[f.eventQuality][f.eventName]) {
          eventBreakdown[f.eventQuality][f.eventName] = 0;
        }
        eventBreakdown[f.eventQuality][f.eventName]++;
      }
    });
    return Object.keys(dist).map(key => ({
      name: key,
      count: dist[key],
      breakdown: eventBreakdown[key]
    }));
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-3 shadow-lg" style={{ backgroundColor: '#1E293B', color: '#fff', border: '1px solid #475569' }}>
          <p className="fw-bold mb-1">{data.name}: {data.value}</p>
          {data.breakdown && Object.keys(data.breakdown).length > 0 && (
            <div className="small text-light-50 mt-2 border-top border-secondary pt-2">
              {Object.entries(data.breakdown).map(([event, count]) => (
                <div key={event} className="d-flex justify-content-between gap-3">
                  <span>{event}</span>
                  <span className="fw-bold text-info">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-3 shadow-lg" style={{ backgroundColor: '#1E293B', color: '#fff', border: '1px solid #475569' }}>
          <p className="fw-bold mb-1">{data.name}: {data.count}</p>
          {data.breakdown && Object.keys(data.breakdown).length > 0 && (
            <div className="small text-light-50 mt-2 border-top border-secondary pt-2">
              {Object.entries(data.breakdown).map(([event, count]) => (
                <div key={event} className="d-flex justify-content-between gap-3">
                  <span>{event}</span>
                  <span className="fw-bold text-info">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-light">Feedback Analytics Dashboard</h2>
        <select className="form-select w-auto rounded-3 shadow-sm bg-dark text-light border-secondary" value={selectedEventId} onChange={handleEventChange}>
          <option value="ALL">ALL EVENTS</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-5 card premium-card border-0 shadow-sm rounded-4 text-muted">
          <i className="bi bi-bar-chart-line fs-1 mb-3"></i>
          <h4>No Analytics Available</h4>
          <p>No feedback has been submitted for this event yet.</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6">
              <div className="card premium-card border-0 shadow-sm rounded-4 p-4 text-center h-100 d-flex justify-content-center">
                <h6 className="text-muted text-uppercase mb-2">Total Responses</h6>
                <div className="display-4 fw-extrabold text-primary">{feedbacks.length}</div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card premium-card border-0 shadow-sm rounded-4 p-4 text-center h-100 d-flex justify-content-center">
                <h6 className="text-muted text-uppercase mb-2">Average Rating</h6>
                <div className="display-4 fw-extrabold text-warning">
                  {getAverageRating()} <i className="bi bi-star-fill fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="card premium-card border-0 shadow-sm rounded-4 p-4 h-100">
                <h5 className="fw-bold mb-4 text-center text-light">Rating Distribution</h5>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getRatingDistribution()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}`}
                      >
                        {getRatingDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={CustomPieTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card premium-card border-0 shadow-sm rounded-4 p-4 h-100">
                <h5 className="fw-bold mb-4 text-center text-light">Event Quality Responses</h5>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getQualityData()}>
                      <XAxis dataKey="name" stroke="#ccc" />
                      <YAxis allowDecimals={false} stroke="#ccc" />
                      <Tooltip content={CustomBarTooltip} />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card premium-card border-0 shadow-sm rounded-4 p-4 mt-4">
            <h5 className="fw-bold mb-4 text-light">Recent Comments</h5>
            <div className="list-group list-group-flush">
              {feedbacks.filter(f => f.comments).map(fb => (
                <div className="list-group-item bg-transparent px-0 py-3 border-bottom border-secondary" key={fb.id}>
                  <div className="d-flex w-100 justify-content-between mb-1">
                    <div>
                      <h6 className="mb-0 fw-bold text-light">{fb.userName}</h6>
                      <small className="text-info d-block mt-1 fw-semibold">{fb.eventName}</small>
                    </div>
                    <small className="text-muted">{new Date(fb.submittedAt).toLocaleDateString()}</small>
                  </div>
                  <p className="mb-1 text-secondary">"{fb.comments}"</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFeedbackDashboard;
