import {crearCategoria, listarCategorias, actualizarCategoria, eliminarCategoria} from '../services/categoria.service.js';

export const crear = async (req, res) => {
  try {
    const restaurantId = req.restaurantId; 
    const categoria = await crearCategoria(restaurantId, req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const listar = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    const categoria = await listarCategorias(restaurantId);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizar = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurantId = req.restaurantId;
    const categoria = await actualizarCategoria(Number(id), restaurantId, req.body)
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



export const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurantId = req.restaurantId;
    const categoria = await eliminarCategoria(Number(id), restaurantId)
    res.status(200).json({
      mensaje: "Categoria eliminada correctamente",
      categoria: categoria
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}