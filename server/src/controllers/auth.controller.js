import { loginUsuario } from '../services/auth.service.js';



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await loginUsuario(email, password);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

