import prisma from '../../config/db.js';

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
    address: restaurante.address,
    isActive: restaurante.isActive,
  };
};