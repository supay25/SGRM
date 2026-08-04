import axiosClient from './axiosClient';

// El descuento viaja siempre como MONTO en colones; el backend recalcula el desglose.
// Factura la orden completa. OrdenMesa ya no la usa: ahora todo pasa por facturarDivididoRequest.
export const crearFacturaRequest = async (mesaId, descuento = 0, nombreCliente = 'Cliente al contado') => {
  const response = await axiosClient.post('/facturas', { mesaId, descuento, nombreCliente });
  return response.data;
};

// Factura solo los items que se le manden (items = [{ productoId, cantidad }]).
// El backend resta esa cantidad de la orden y libera la mesa si queda vacía.
// Sirve tanto para facturar toda la mesa (mandando todo) como para una cuenta dividida.
export const facturarDivididoRequest = async (
  mesaId,
  items,
  descuento = 0,
  nombreCliente = 'Cliente al contado'
) => {
  const response = await axiosClient.post('/facturas/dividir', {
    mesaId,
    items,
    descuento,
    nombreCliente,
  });
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