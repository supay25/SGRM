import prisma from '../config/db.js';
import bcrypt, { compare } from 'bcryptjs';


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

  // Devolvemos el usuario sin el campo password (el cliente no necesita ver el hash)
  const { password: _, ...usuarioSinPassword } = nuevoUsuario;
  return usuarioSinPassword;
};



export const loginUsuario = async (email, password) => {

  const usuarioExistente = await prisma.user.aggregate.findUnique({ where: { email } });

  if (!usuarioExistente) {
    throw new Error('Credenciales incorrectas');
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw new Error('Credenciales incorrectas');
  }




};