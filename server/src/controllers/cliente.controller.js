// cliente.controller.js
import { listarClientes, crearCliente, actualizarCliente, eliminarCliente } from '../services/cliente.service.js';

export const listar = async (req, res) => {
  try {
    const data = await listarClientes(req.usuario.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const data = await crearCliente(req.usuario.id, req.body.nombre);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const data = await actualizarCliente(Number(req.params.id), req.usuario.id, req.body.nombre);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const data = await eliminarCliente(Number(req.params.id), req.usuario.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};