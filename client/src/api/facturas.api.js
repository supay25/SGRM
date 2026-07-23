import axiosClient from './axiosClient';

export const crearFacturaRequest = async (mesaId) => {
  const response = await axiosClient.post('/facturas', { mesaId });
  return response.data;
};

export const getFacturasRequest = async () => {
  const response = await axiosClient.get('/facturas');
  return response.data;
};

export const getFacturaDetalleRequest = async (facturaId) => {
  const response = await axiosClient.get(`/facturas/${facturaId}`);
  return response.data;
};

export const anularFacturaRequest = async (facturaId, motivo) => {
  const response = await axiosClient.patch(`/facturas/${facturaId}/anular`, { motivo });
  return response.data;
};