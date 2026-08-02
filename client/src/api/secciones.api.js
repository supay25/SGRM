import axiosClient from './axiosClient';

export const getSecciones = async () => {
  const response = await axiosClient.get('/secciones');
  return response.data;
};


export const crearSeccionRequest = async (datos) => {
  const response = await axiosClient.post('/secciones', datos);
  return response.data;
};
export const actualizarSeccionRequest = async (id, datos) => {
  const response = await axiosClient.put(`/secciones/${id}`, datos);
  return response.data;
};
export const eliminarSeccionRequest = async (id) => {
  const response = await axiosClient.delete(`/secciones/${id}`);
  return response.data;
};