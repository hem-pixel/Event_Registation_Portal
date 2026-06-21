import api from './api';

const qrService = {
  getQrCodeByRegistration: async (registrationId) => {
    const response = await api.get(`/api/qr/${registrationId}`);
    return response.data;
  },
  generateQrCode: async (registrationId) => {
    const response = await api.post(`/api/qr/generate/${registrationId}`);
    return response.data;
  }
};

export default qrService;
