import { registrarUsuario } from '../services/auth.service.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const nuevoUsuario = await registrarUsuario({ name, email, password });
  res.status(201).json({ message: 'Usuario creado exitosamente', user: nuevoUsuario });
};
