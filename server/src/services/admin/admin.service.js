import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';

// ── OWNERS ──

export const listarOwners = async () => {
  return await prisma.user.findMany({
    where: { role: 'OWNER' },
    select: {
      id: true, name: true, email: true, isActive: true, createdAt: true,
      _count: { select: { restaurants: true } },   // cuántos restaurantes tiene
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const crearOwner = async ({ name, email, password }) => {
  if (!name?.trim() || !email?.trim() || !password) {
    throw new Error('Nombre, email y contraseña son obligatorios');
  }
  if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe) throw new Error('Ese email ya está registrado');

  const passwordHash = await bcrypt.hash(password, 10);
  const owner = await prisma.user.create({
    data: { name: name.trim(), email: email.trim(), password: passwordHash, role: 'OWNER' },
    select: { id: true, name: true, email: true, isActive: true },
  });
  return owner;
};

export const toggleOwnerActivo = async (ownerId) => {
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner) throw new Error('Owner no encontrado');

  return await prisma.user.update({
    where: { id: ownerId },
    data: { isActive: !owner.isActive },
    select: { id: true, name: true, email: true, isActive: true },
  });
};

// ── RESTAURANTES ──

export const listarTodosRestaurantes = async () => {
  return await prisma.restaurant.findMany({
    select: {
      id: true, name: true, email: true, isActive: true,
      user: { select: { id: true, name: true } },   // a qué owner pertenece
    },
    orderBy: { createdAt: 'desc' },
  });
};




export const crearRestaurante = async ({ name, email, password, userId }) => {
  if (!name?.trim() || !email?.trim() || !password || !userId) {
    throw new Error('Nombre, email, contraseña y owner son obligatorios');
  }
  if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

  // Verificar que el owner exista
  const owner = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!owner) throw new Error('El owner asignado no existe');

  const existe = await prisma.restaurant.findUnique({ where: { email } });
  if (existe) throw new Error('Ese email ya está registrado');

  const passwordHash = await bcrypt.hash(password, 10);
  const restaurante = await prisma.restaurant.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      password: passwordHash,
      userId: Number(userId),
    },
    select: { id: true, name: true, email: true, isActive: true },
  });
  return restaurante;
};




export const toggleRestauranteActivo = async (restauranteId) => {
  const rest = await prisma.restaurant.findUnique({ where: { id: restauranteId } });
  if (!rest) throw new Error('Restaurante no encontrado');

  return await prisma.restaurant.update({
    where: { id: restauranteId },
    data: { isActive: !rest.isActive },
    select: { id: true, name: true, email: true, isActive: true },
  });
};






export const actualizarPerfilAdmin = async (adminId, nombre) => {
  if (!nombre || !nombre.trim()) throw new Error('El nombre es obligatorio');
  return await prisma.user.update({
    where: { id: adminId },
    data: { name: nombre.trim() },
    select: { id: true, name: true, email: true, role: true },
  });
};

export const cambiarPasswordAdmin = async (adminId, passwordActual, passwordNueva) => {
  if (!passwordActual || !passwordNueva) throw new Error('Ambas contraseñas son obligatorias');
  if (passwordNueva.length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres');

  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin) throw new Error('Usuario no encontrado');

  const coincide = await bcrypt.compare(passwordActual, admin.password);
  if (!coincide) throw new Error('La contraseña actual es incorrecta');

  const hash = await bcrypt.hash(passwordNueva, 10);
  await prisma.user.update({
    where: { id: adminId },
    data: { password: hash },
  });

  return { mensaje: 'Contraseña actualizada' };
};