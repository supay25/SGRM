import prisma from '../config/db.js';

export const obtenerConfig = async (restaurantId) => {
  const restaurante = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      cedulaJuridica: true,
      tipoCambioDolar: true,
    },
  });
  if (!restaurante) throw new Error('Restaurante no encontrado');
  return restaurante;
};


export const actualizarConfig = async (restaurantId, datos) => {
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