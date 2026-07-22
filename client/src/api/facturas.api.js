import axiosClient from './axiosClient';

export const crearFacturaRequest = async (mesaId) => {
  const response = await axiosClient.post('/facturas', { mesaId });
  return response.data;
};