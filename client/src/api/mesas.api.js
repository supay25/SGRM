import axiosClient from './axiosClient';

export const getMesa = async (mesaId) => {
  const response = await axiosClient.get(`/mesas/${mesaId}`);
  return response.data;
};

export const getMesas = async () => {
  const response = await axiosClient.get('/mesas');
  return response.data;
};

export const crearMesaRequest = async (datos) => {
  const response = await axiosClient.post('/mesas', datos);
  return response.data;
};

export const actualizarMesaRequest = async (mesaId, datos) => {
  const response = await axiosClient.put(`/mesas/${mesaId}`, datos);
  return response.data;
};

export const eliminarMesaRequest = async (mesaId) => {
  const response = await axiosClient.delete(`/mesas/${mesaId}`);
  return response.data;
};