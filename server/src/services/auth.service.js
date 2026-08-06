import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../helpers/jwt.js';

export const registrarUsuario = async ({ name, email, password }) => {
  const usuarioExistente = await prisma.user.findUnique({ where: { email } });
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  // Nunca guardamos la contraseña en texto plano — bcrypt la convierte en un hash irreversible
  const passwordHash = await bcrypt.hash(password, 10);

  const nuevoUsuario = await prisma.user.create({
    data: { name, email, password: passwordHash },
  });

  // Devolvemos el usuario sin el campo password
  const { password: _, ...usuarioSinPassword } = nuevoUsuario;
  return usuarioSinPassword;
};


export const loginUsuario = async (email, password) => {
  let cuenta = await prisma.user.findUnique({ where: { email } });
  let accountType = 'USER';

  if (!cuenta) {
    cuenta = await prisma.restaurant.findUnique({
      where: { email },
      include: { user: true },   //  traemos el owner para verificar su estado
    });
    accountType = 'RESTAURANT';
  }

  if (!cuenta) {
    throw new Error('Credenciales invalidas');
  }

  if (!cuenta.isActive) {
    throw new Error('Esta cuenta se encuentra deshabilitada');
  }

  // Cascadasi es un restaurante, su owner tambien debe estar activo
  if (accountType === 'RESTAURANT' && cuenta.user && !cuenta.user.isActive) {
    throw new Error('Esta cuenta se encuentra deshabilitada');
  }

  const isMatch = await bcrypt.compare(password, cuenta.password);
  if (!isMatch) {
    throw new Error('Credenciales invalidas');
  }

  const payload = { id: cuenta.id, type: accountType };
  if (accountType === 'USER') {
    payload.role = cuenta.role;
  }

  const token = generateToken(payload);

  const user = {
    id: cuenta.id,
    name: cuenta.name,
    email: cuenta.email,
  };
  if (accountType === 'USER') {
    user.role = cuenta.role;
  }

  return { accountType, user, token };
};