// mesa.cotroller.js
import {crearMesa, listarMesas, actualizarMesa, eliminarMesa, obtenerMesa }from '../services/mesa.service.js';
 
export const crear = async (req, res) => {
  try {
    const restaurantId = req.usuario.id; 
    const mesa = await crearMesa(restaurantId, req.body);
    res.status(201).json(mesa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listar = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const mesa = await listarMesas(restaurantId);
    res.status(200).json(mesa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const actualizar = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurantId = req.usuario.id;
    const mesa = await actualizarMesa(Number(id), restaurantId, req.body)
    res.status(200).json(mesa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}




export const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurantId = req.usuario.id;
    const mesa = await eliminarMesa(Number(id), restaurantId)
    res.status(200).json({
      mensaje: "mesa eliminada correctamente",
      mesa: mesa
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


export const obtener = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurantId = req.usuario.id;
    const mesa = await obtenerMesa(Number(id), restaurantId);
    res.status(200).json(mesa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};