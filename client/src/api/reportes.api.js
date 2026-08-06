import axiosClient from './axiosClient'

export const getVentasPorPeriodoRequest = async (restaurantId, desde, hasta) => {
  const response = await axiosClient.get(`/owner/restaurantes/${restaurantId}/reportes/ventas`, {
    params: { desde, hasta },
  })
  return response.data
}

export const getServicioPorPeriodoRequest = async (restaurantId, desde, hasta) => {
  const response = await axiosClient.get(`/owner/restaurantes/${restaurantId}/reportes/servicio`, {
    params: { desde, hasta },
  })
  return response.data
}

export const getProductosPorCategoriaRequest = async (restaurantId, desde, hasta) => {
  const response = await axiosClient.get(`/owner/restaurantes/${restaurantId}/reportes/productos`, {
    params: { desde, hasta },
  })
  return response.data
}

export const getConsecutivoFacturasRequest = async (restaurantId, desde, hasta) => {
  const response = await axiosClient.get(`/owner/restaurantes/${restaurantId}/reportes/consecutivo`, {
    params: { desde, hasta },
  })
  return response.data
}


export const crearCierreFechaRequest = async (fecha) => {
  const response = await axiosClient.post('/cierres', { fecha })
  return response.data
}



export const getMisVentasRequest = async (desde, hasta) => {
  const response = await axiosClient.get('/reportes/ventas', { params: { desde, hasta } })
  return response.data
}

export const getMisServicioRequest = async (desde, hasta) => {
  const response = await axiosClient.get('/reportes/servicio', { params: { desde, hasta } })
  return response.data
}

export const getMisProductosRequest = async (desde, hasta) => {
  const response = await axiosClient.get('/reportes/productos', { params: { desde, hasta } })
  return response.data
}

export const getMisConsecutivoRequest = async (desde, hasta) => {
  const response = await axiosClient.get('/reportes/consecutivo', { params: { desde, hasta } })
  return response.data
}

export const getMisCierrePorFechaRequest = async (fecha) => {
  const response = await axiosClient.get('/reportes/cierres/buscar', { params: { fecha } })
  return response.data
}

export const getMisFacturaPorNumeroRequest = async (numero) => {
  const response = await axiosClient.get(`/reportes/facturas/${numero}`)
  return response.data
}