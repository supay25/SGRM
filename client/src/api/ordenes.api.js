import axiosClient from './axiosClient';

export const getOrdenDeMesa = async (mesaId) => {
  const response = await axiosClient.get(`/ordenes/mesa/${mesaId}`);
  return response.data;
};

export const ingresarOrdenRequest = async (mesaId, items) => {
  const response = await axiosClient.put(`/ordenes/mesa/${mesaId}`, { items });
  return response.data;
};

export const reiniciarOrdenRequest = async (mesaId) => {
  const response = await axiosClient.delete(`/ordenes/mesa/${mesaId}`);
  return response.data;
};



