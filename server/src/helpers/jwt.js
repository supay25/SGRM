import jwt from 'jsonwebtoken';

/**
 * Genera un token JWT firmado para un usuario
 * @param {Object} payload - Datos que viajarán en el token (id, role, etc.)
 * @returns {String} Token encriptado
 */
export const generateToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' } // Tu "pulsera" dura 24 horas activa
  );
};