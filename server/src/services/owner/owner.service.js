import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';

import { ventasRango } from '../../services/reportes.service.js';

export const listarMisRestaurantes = async (ownerId) => {
  return await prisma.restaurant.findMany({
    where: { userId: ownerId },
    select: { id: true, name: true, email: true, phone: true, address: true, isActive: true },
  });
};

export const validarRestauranteDelOwner = async (ownerId, restaurantId) => {
  const restaurante = await prisma.restaurant.findFirst({
    where: { id: restaurantId, userId: ownerId },
  });
  if (!restaurante) throw new Error('Restaurante no encontrado o no autorizado');
  return restaurante;
};

export const detalleRestaurante = async (ownerId, restaurantId) => {
  const restaurante = await validarRestauranteDelOwner(ownerId, restaurantId);
  return {
    id: restaurante.id,
    name: restaurante.name,
    email: restaurante.email,
    phone: restaurante.phone,
    address: restaurante.address,
    cedulaJuridica: restaurante.cedulaJuridica,
    tipoCambioDolar: restaurante.tipoCambioDolar,
    isActive: restaurante.isActive,
  };
};





export const actualizarPerfilOwner = async (ownerId, nombre) => {
  if (!nombre || !nombre.trim()) throw new Error('El nombre es obligatorio');
  return await prisma.user.update({
    where: { id: ownerId },
    data: { name: nombre.trim() },
    select: { id: true, name: true, email: true, role: true },
  });
};




export const cambiarPasswordOwner = async (ownerId, passwordActual, passwordNueva) => {
  if (!passwordActual || !passwordNueva) throw new Error('Ambas contraseñas son obligatorias');
  if (passwordNueva.length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres');

  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner) throw new Error('Usuario no encontrado');

  // Verificar que la contraseña actual sea correcta
  const coincide = await bcrypt.compare(passwordActual, owner.password);
  if (!coincide) throw new Error('La contraseña actual es incorrecta');

  // Hashear y guardar la nueva
  const hash = await bcrypt.hash(passwordNueva, 10);
  await prisma.user.update({
    where: { id: ownerId },
    data: { password: hash },
  });

  return { mensaje: 'Contraseña actualizada' };
};





export const actualizarRestauranteDelOwner = async (ownerId, restaurantId, datos) => {
  // Validar pertenencia primero (reusa la función que ya tenés)
  await validarRestauranteDelOwner(ownerId, restaurantId);

  const { name, phone, address, cedulaJuridica, tipoCambioDolar } = datos;
  return await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { name, phone, address, cedulaJuridica, tipoCambioDolar },
    select: {
      id: true, name: true, email: true, phone: true,
      address: true, cedulaJuridica: true, tipoCambioDolar: true,
    },
  });
};




export const resetearPasswordRestaurante = async (ownerId, restaurantId, passwordNueva) => {
  await validarRestauranteDelOwner(ownerId, restaurantId);

  if (!passwordNueva || passwordNueva.length < 6) {
    throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
  }

  const hash = await bcrypt.hash(passwordNueva, 10);
  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { password: hash },
  });

  return { mensaje: 'Contraseña del restaurante actualizada' };
};






export const comparativaRestaurantes = async (ownerId, desde, hasta) => {
  // Todos los restaurantes del owner
  const restaurantes = await prisma.restaurant.findMany({
    where: { userId: ownerId },
    select: { id: true, name: true },
  });

  // Para cada uno, calcular el ingreso real del rango (reusa ventasRango)
  const datos = await Promise.all(
    restaurantes.map(async (r) => {
      const ventas = await ventasRango(r.id, desde, hasta);
      return {
        restauranteId: r.id,
        nombre: r.name,
        ingresoReal: ventas.ingresoReal,
        totalNeto: ventas.totalNeto,
        totalServicio: ventas.totalServicio,
        cantidadFacturas: ventas.cantidadFacturas,
      };
    })
  );

  return datos;
};