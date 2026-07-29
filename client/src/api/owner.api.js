import axiosClient from './axiosClient';

export const getMisRestaurantesRequest = async () => {
  const response = await axiosClient.get('/owner/restaurantes');
  return response.data;
};


export const getDetalleRestauranteRequest = async (id) => {
  const response = await axiosClient.get(`/owner/restaurantes/${id}`);
  return response.data;
};
export const getResumenRestauranteRequest = async (id) => {
  const response = await axiosClient.get(`/owner/restaurantes/${id}/resumen`);
  return response.data;
};
export const getMetricasRestauranteRequest = async (id) => {
  const response = await axiosClient.get(`/owner/restaurantes/${id}/metricas`);
  return response.data;
};
export const getCierresRestauranteRequest = async (id) => {
  const response = await axiosClient.get(`/owner/restaurantes/${id}/cierres`);
  return response.data;
};

export const buscarFacturaPorNumeroRequest = async (restaurantId, numero) => {
  const response = await axiosClient.get(`/owner/restaurantes/${restaurantId}/facturas/${numero}`);
  return response.data;
};

export const buscarCierrePorFechaRequest = async (restaurantId, fecha) => {
  const response = await axiosClient.get(`/owner/restaurantes/${restaurantId}/cierres/buscar`, {
    params: { fecha },
  });
  return response.data;
};