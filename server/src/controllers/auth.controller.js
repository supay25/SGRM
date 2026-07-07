import { registrarUsuario, loginUsuario } from '../services/auth.service.js';

export const registrar = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const usuario = await registrarUsuario({ name, email, password });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await loginUsuario(email, password);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};