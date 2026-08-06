import {
  listarOwners, crearOwner, toggleOwnerActivo,
  listarTodosRestaurantes, crearRestaurante, toggleRestauranteActivo, actualizarPerfilAdmin,cambiarPasswordAdmin
} from '../../services/admin/admin.service.js';


export const getOwners = async (req, res) => {
  try {
    res.status(200).json(await listarOwners());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const postOwner = async (req, res) => {
  try {
    res.status(201).json(await crearOwner(req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const patchOwnerActivo = async (req, res) => {
  try {
    res.status(200).json(await toggleOwnerActivo(Number(req.params.id)));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRestaurantes = async (req, res) => {
  try {
    res.status(200).json(await listarTodosRestaurantes());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const postRestaurante = async (req, res) => {
  try {
    res.status(201).json(await crearRestaurante(req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const patchRestauranteActivo = async (req, res) => {
  try {
    res.status(200).json(await toggleRestauranteActivo(Number(req.params.id)));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





export const editarPerfil = async (req, res) => {
  try {
    const data = await actualizarPerfilAdmin(req.usuario.id, req.body.nombre);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const data = await cambiarPasswordAdmin(req.usuario.id, passwordActual, passwordNueva);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};