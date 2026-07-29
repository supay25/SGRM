// owner.controller.js
import { listarMisRestaurantes,detalleRestaurante, resumenDiaRestaurante, cierresRestaurante,facturasRestaurante, metricasRestaurante, buscarFacturaPorNumero, buscarCierrePorFecha} from '../../services/owner/owner.service.js';

export const misRestaurantes = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantes = await listarMisRestaurantes(ownerId);
    res.status(200).json(restaurantes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const resumenRestaurante = async (req, res) => {
  try {
    const data = await resumenDiaRestaurante(req.usuario.id, Number(req.params.id));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cierres = async (req, res) => {
  try {
    const data = await cierresRestaurante(req.usuario.id, Number(req.params.id));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const facturas = async (req, res) => {
  try {
    const data = await facturasRestaurante(req.usuario.id, Number(req.params.id));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const metricas = async (req, res) => {
  try {
    const data = await metricasRestaurante(req.usuario.id, Number(req.params.id));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const misdetallesRestaurante = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurante = await detalleRestaurante(ownerId, Number(req.params.id));  // 👈 falta el id
    res.status(200).json(restaurante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const buscarFactura = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    const numero = Number(req.params.numero);
    const factura = await buscarFacturaPorNumero(ownerId, numero, restaurantId);
    res.status(200).json(factura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const buscarCierre = async (req, res) => {
  try {
    const ownerId = req.usuario.id;
    const restaurantId = Number(req.params.id);
    const { fecha } = req.query;
    const cierre = await buscarCierrePorFecha(ownerId, restaurantId, fecha);
    res.status(200).json(cierre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}