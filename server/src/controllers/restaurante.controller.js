import { obtenerConfig, actualizarConfig } from '../services/restaurante.service.js';

export const getConfig = async (req, res) => {
  try {
    const data = await obtenerConfig(req.restaurantId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const patchConfig = async (req, res) => {
  try {
    const data = await actualizarConfig(req.restaurantId, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};