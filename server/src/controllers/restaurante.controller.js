import { obtenerConfig, actualizarConfig } from '../services/restaurante.service.js';

export const getConfig = async (req, res) => {
  try {
    const data = await obtenerConfig(req.usuario.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const patchConfig = async (req, res) => {
  try {
    const data = await actualizarConfig(req.usuario.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};