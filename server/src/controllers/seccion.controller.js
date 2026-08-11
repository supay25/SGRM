import { crearSeccion, listarSecciones, actualizarSecciones, eliminarSeccion } from "../services/seccion.service.js";

export const crear = async (req, res) => {
  try {
    const restaurantId = req.restaurantId; // viene del token, ya verificado por el middleware
    const seccion = await crearSeccion(restaurantId, req.body);
    res.status(201).json(seccion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const listar = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    const secciones = await listarSecciones(restaurantId);
    res.status(200).json(secciones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizar = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurantId = req.restaurantId;
    const seccion = await actualizarSecciones(Number(id), restaurantId, req.body)
    res.status(200).json(seccion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



export const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurantId = req.restaurantId;
    const seccion = await eliminarSeccion(Number(id), restaurantId)
    res.status(200).json({
      mensaje: "Sección eliminada correctamente",
      seccion: seccion
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}