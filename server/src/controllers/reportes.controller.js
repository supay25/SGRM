// server/src/controllers/reportes.controller.js
import {
  ventasRango,
  servicioRango,
  productosPorCategoriaRango,
  consecutivoRango,
  buscarCierrePorFecha,
  buscarFacturaPorNumero,
} from '../services/reportes.service.js';

export const misVentas = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { desde, hasta } = req.query;
    const data = await ventasRango(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const misServicio = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { desde, hasta } = req.query;
    const data = await servicioRango(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const misProductos = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { desde, hasta } = req.query;
    const data = await productosPorCategoriaRango(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const misConsecutivo = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { desde, hasta } = req.query;
    const data = await consecutivoRango(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const misBuscarCierre = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const data = await buscarCierrePorFecha(restaurantId, req.query.fecha);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const misBuscarFactura = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const data = await buscarFacturaPorNumero(restaurantId, Number(req.params.numero));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
}
};



export const getMisCierrePorFechaRequest = async (fecha) => {
  const response = await axiosClient.get('/reportes/cierres/buscar', { params: { fecha } })
  return response.data
}

export const getMisFacturaPorNumeroRequest = async (numero) => {
  const response = await axiosClient.get(`/reportes/facturas/${numero}`)
  return response.data
}