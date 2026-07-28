import axiosClient from './axiosClient';

export const getCategoriasRequest = async () => {
  const response = await axiosClient.get('/categorias');
  return response.data;
};
export const crearCategoriaRequest = async (datos) => {
  const response = await axiosClient.post('/categorias', datos);
  return response.data;
};
export const actualizarCategoriaRequest = async (id, datos) => {
  const response = await axiosClient.put(`/categorias/${id}`, datos);
  return response.data;
};
export const eliminarCategoriaRequest = async (id) => {
  const response = await axiosClient.delete(`/categorias/${id}`);
  return response.data;
};