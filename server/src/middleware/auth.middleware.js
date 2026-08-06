import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // El header debe venir como: "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No se proporcionó un token válido' });
  }

  // "Bearer eyJhbG..." → separamos por espacio y nos quedamos con la segunda parte
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify hace DOS cosas a la vez: revisa la firma Y revisa si expiró
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Pegamos el payload decodificado en req, para que el controller lo use después
    req.usuario = payload; // { id, type, role? }

    next(); // todo bien, deja pasar la petición al controller
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};




export const soloOwner = (req, res, next) => {
  if (req.usuario.type !== 'USER' || req.usuario.role !== 'OWNER') {
    return res.status(403).json({ error: 'No autorizado' });
  }
  next();
};


export const soloSuperAdmin = (req, res, next) => {
  if (req.usuario.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Acceso solo para administradores' });
  }
  next();
};