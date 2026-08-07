import rateLimit from 'express-rate-limit';

// Límite para el login: máximo 10 intentos cada 15 minutos por IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutos
  max: 10,                     // 10 intentos por ventana
  message: { error: 'Demasiados intentos de inicio de sesión. Esperá unos minutos e intentá de nuevo.' },
  standardHeaders: true,
  legacyHeaders: false,
});