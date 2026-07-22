import { obtenerOrdenActivaDeMesa, agregarProductoAOrden, eliminarProductoOrden, vaciarOrden, ingresarOrden} from '../services/orden.service.js';

export const verOrden = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { mesaId } = req.params;
    const orden = await obtenerOrdenActivaDeMesa(restaurantId, Number(mesaId));
    res.status(200).json(orden);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const agregarProducto = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { mesaId } = req.params;
    const { productoId, cantidad } = req.body;
    const orden = await agregarProductoAOrden(restaurantId, Number(mesaId), productoId, cantidad);
    res.status(200).json(orden);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const quitarProducto = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { ordenItemId } = req.params;
    const orden = await eliminarProductoOrden(Number(ordenItemId), restaurantId);
    res.status(200).json(orden);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const reiniciar = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { mesaId } = req.params;
    const resultado = await vaciarOrden(restaurantId, Number(mesaId));
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// orden.controller.js — agregar:
export const ingresar = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { mesaId } = req.params;
    const { items } = req.body; // [{ productoId, cantidad }, ...]
    const orden = await ingresarOrden(restaurantId, Number(mesaId), items);
    res.status(200).json(orden);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};