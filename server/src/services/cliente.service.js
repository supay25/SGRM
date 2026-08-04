import prisma from '../config/db.js';

export const listarClientes = async (restaurantId) => {
  return await prisma.cliente.findMany({
    where: { restaurantId },
    orderBy: { nombre: 'asc' },
  });
};

export const crearCliente = async (restaurantId, nombre) => {
  if (!nombre || !nombre.trim()) throw new Error('El nombre es obligatorio');
  return await prisma.cliente.create({
    data: { nombre: nombre.trim(), restaurantId },
  });
};

export const actualizarCliente = async (clienteId, restaurantId, nombre) => {
  const cliente = await prisma.cliente.findFirst({
    where: { id: clienteId, restaurantId },
  });
  if (!cliente) throw new Error('Cliente no encontrado');
  return await prisma.cliente.update({
    where: { id: clienteId },
    data: { nombre: nombre.trim() },
  });
};

export const eliminarCliente = async (clienteId, restaurantId) => {
  const cliente = await prisma.cliente.findFirst({
    where: { id: clienteId, restaurantId },
  });
  if (!cliente) throw new Error('Cliente no encontrado');
  return await prisma.cliente.delete({ where: { id: clienteId } });
};