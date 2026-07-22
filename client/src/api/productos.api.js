import axiosClient from './axiosClient';

export const getProductos = async () => {
  const response = await axiosClient.get('/productos');
  return response.data;
};