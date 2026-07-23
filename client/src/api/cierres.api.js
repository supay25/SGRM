import axiosClient from './axiosClient';

export const getCierresRequest = async () => {
  const response = await axiosClient.get('/cierres');
  return response.data;
};

export const crearCierreRequest = async () => {
  const response = await axiosClient.post('/cierres');
  return response.data;
};

export const getCierreReporteRequest = async (cierreId) => {
  const response = await axiosClient.get(`/cierres/${cierreId}/reporte`);
  return response.data;
};
