// cierre.controller.js
import { crearCierre, obtenerReporteCierre, listarCierres } from '../services/cierre.service.js';

export const crear = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const cierre = await crearCierre(restaurantId);
    res.status(201).json(cierre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listar = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const cierres = await listarCierres(restaurantId);
    res.status(200).json(cierres);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reporte = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { id } = req.params;
    const data = await obtenerReporteCierre(restaurantId, Number(id));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


