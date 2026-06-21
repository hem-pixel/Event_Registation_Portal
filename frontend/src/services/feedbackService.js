import api from './api';

const feedbackService = {
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/api/feedback', feedbackData);
    return response.data;
  },
  getFeedbackByEvent: async (eventId) => {
    const response = await api.get(`/api/feedback/event/${eventId}`);
    return response.data;
  },
  getAllFeedback: async () => {
    const response = await api.get('/api/feedback');
    return response.data;
  },
  getFeedbackByUser: async (userId) => {
    const response = await api.get(`/api/feedback/user/${userId}`);
    return response.data;
  },
  deleteFeedback: async (id) => {
    const response = await api.delete(`/api/feedback/${id}`);
    return response.data;
  }
};

export default feedbackService;
