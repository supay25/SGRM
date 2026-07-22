import axiosClient from './axiosClient';

export const getSecciones = async () => {
  const response = await axiosClient.get('/secciones');
  return response.data;
};