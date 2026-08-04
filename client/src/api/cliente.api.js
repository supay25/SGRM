import axiosClient from './axiosClient';

export const getClientesRequest = async () => {
  const response = await axiosClient.get('/clientes');
  return response.data;
};
export const crearClienteRequest = async (nombre) => {
  const response = await axiosClient.post('/clientes', { nombre });
  return response.data;
};
export const actualizarClienteRequest = async (id, nombre) => {
  const response = await axiosClient.put(`/clientes/${id}`, { nombre });
  return response.data;
};
export const eliminarClienteRequest = async (id) => {
  const response = await axiosClient.delete(`/clientes/${id}`);
  return response.data;
};
export const editarClienteFacturaRequest = async (facturaId, nombreCliente) => {
  const response = await axiosClient.patch(`/facturas/${facturaId}/cliente`, { nombreCliente });
  return response.data;
};