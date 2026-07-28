// owner.controller.js
import { listarMisRestaurantes, resumenDiaRestaurante, cierresRestaurante,facturasRestaurante, metricasRestaurante} from '../../services/owner/owner.service.js';

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