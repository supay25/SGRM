import {
  listarMisRestaurantes,
  detalleRestaurante,
  validarRestauranteDelOwner,
} from '../../services/owner/owner.service.js';

import {
  resumenDia,
  metricas,
  cierres,
  facturas,
  buscarCierrePorFecha,
  buscarFacturaPorNumero,
  ventasRango,
  servicioRango,
  productosPorCategoriaRango,
  consecutivoRango,
} from '../../services/reportes.service.js';

export const misRestaurantes = async (req, res) => {
  try {
    const data = await listarMisRestaurantes(req.usuario.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const misdetallesRestaurante = async (req, res) => {
  try {
    const data = await detalleRestaurante(req.usuario.id, Number(req.params.id));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resumenRestaurante = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await resumenDia(restaurantId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const metricasRestaurante = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const { desde, hasta } = req.query;
    const data = await metricas(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cierresRestaurante = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await cierres(restaurantId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const facturasRestaurante = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await facturas(restaurantId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const buscarCierre = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await buscarCierrePorFecha(restaurantId, req.query.fecha);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const buscarFactura = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await buscarFacturaPorNumero(restaurantId, Number(req.params.numero));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reporteVentas = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    const { desde, hasta } = req.query;
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await ventasRango(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reporteServicio = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    const { desde, hasta } = req.query;
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await servicioRango(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reporteProductos = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    const { desde, hasta } = req.query;
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await productosPorCategoriaRango(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reporteConsecutivo = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    const { desde, hasta } = req.query;
    await validarRestauranteDelOwner(ownerId, restaurantId);
    const data = await consecutivoRango(restaurantId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// En owner.controller.js
import {
  actualizarPerfilOwner, cambiarPasswordOwner,
  actualizarRestauranteDelOwner, resetearPasswordRestaurante,
} from '../../services/owner/owner.service.js';

export const editarPerfil = async (req, res) => {
  try {
    const data = await actualizarPerfilOwner(req.usuario.id, req.body.nombre);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const data = await cambiarPasswordOwner(req.usuario.id, passwordActual, passwordNueva);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editarRestaurante = async (req, res) => {
  try {
    const data = await actualizarRestauranteDelOwner(req.usuario.id, Number(req.params.id), req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetearPasswordRest = async (req, res) => {
  try {
    const data = await resetearPasswordRestaurante(req.usuario.id, Number(req.params.id), req.body.passwordNueva);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

import { comparativaRestaurantes } from '../../services/owner/owner.service.js';

export const comparativa = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const { desde, hasta } = req.query;
    const data = await comparativaRestaurantes(ownerId, desde, hasta);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};