import api from './api';

const attendanceService = {
  checkIn: async (registrationId) => {
    const response = await api.post(`/api/attendance/check-in/${registrationId}`);
    return response.data;
  },
  scanQrCode: async (registrationId) => {
    const response = await api.post('/api/attendance/scan', { registrationId });
    return response.data;
  },
  getAttendanceByEvent: async (eventId) => {
    const response = await api.get(`/api/attendance/event/${eventId}`);
    return response.data;
  },
  getMyAttendance: async () => {
    const response = await api.get('/api/attendance/my-attendance');
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/api/attendance/stats');
    return response.data;
  }
};

export default attendanceService;
