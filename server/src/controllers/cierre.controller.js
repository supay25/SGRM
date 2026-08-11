// cierre.controller.js
import { crearCierre, obtenerReporteCierre, listarCierres, resumenDelDia } from '../services/cierre.service.js';

export const crear = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    const { fecha } = req.body || {};
    const cierre = await crearCierre(restaurantId, fecha || null);
    res.status(201).json(cierre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const listar = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    const cierres = await listarCierres(restaurantId);
    res.status(200).json(cierres);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reporte = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    const { id } = req.params;
    const data = await obtenerReporteCierre(restaurantId, Number(id));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const reporteDia = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    const { id } = req.params;
    const data = await resumenDelDia(restaurantId, Number(id));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




