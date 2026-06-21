import api from './api';

const registrationService = {
  registerForEvent: async (registrationData) => {
    const response = await api.post('/api/registrations/register', registrationData);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/api/registrations/my-registrations');
    return response.data;
  },

  getRegistrationsForEvent: async (eventId) => {
    const response = await api.get(`/api/registrations/event/${eventId}`);
    return response.data;
  },

  getAllRegistrations: async () => {
    const response = await api.get('/api/registrations/all');
    return response.data;
  },

  exportRegistrationsToExcel: async (eventId, eventTitle) => {
    const response = await api.get(`/api/registrations/export/excel?eventId=${eventId}`, {
      responseType: 'blob'
    });
    
    // Create temporary link to trigger native browser file download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const fileName = `registrations_${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  markAttendance: async (registrationId) => {
    const response = await api.post(`/api/attendance/check-in/${registrationId}`);
    return response.data;
  },

  getAttendanceForEvent: async (eventId) => {
    const response = await api.get(`/api/attendance/event/${eventId}`);
    return response.data;
  },

  getAllAttendance: async () => {
    const response = await api.get('/api/attendance/all');
    return response.data;
  },

  getMyAttendance: async () => {
    const response = await api.get('/api/attendance/my-attendance');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/api/attendance/stats');
    return response.data;
  },

  exportAllAttendanceToExcel: async () => {
    const response = await api.get('/api/attendance/export/excel/all', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'all_attendance_report.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export default registrationService;
