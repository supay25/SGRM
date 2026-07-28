import axiosClient from './axiosClient';

export const getProductos = async () => {
  const response = await axiosClient.get('/productos');
  return response.data;
};

export const crearProductoRequest = async (datos) => {
  const response = await axiosClient.post('/productos', datos);
  return response.data;
};

export const actualizarProductoRequest = async (id, datos) => {
  const response = await axiosClient.put(`/productos/${id}`, datos);
  return response.data;
};

export const eliminarProductoRequest = async (id) => {
  const response = await axiosClient.delete(`/productos/${id}`);
  return response.data;
};