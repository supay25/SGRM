import {crearProducto, listarProductos, actualizarProducto, eliminarProducto} from '../services/producto.service.js';

export const crear = async (req, res) => {
  try {
    const restaurantId = req.restaurantId; 
    const producto = await crearProducto(restaurantId, req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const listar = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    const producto = await listarProductos(restaurantId);
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizar = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurantId = req.restaurantId;
    const producto = await actualizarProducto(Number(id), restaurantId, req.body)
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}





export const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurantId = req.usuario.id;
    const producto = await eliminarProducto(Number(id), restaurantId)
    res.status(200).json({
      mensaje: "producto eliminado correctamente",
      producto: producto
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}