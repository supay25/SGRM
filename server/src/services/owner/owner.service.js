import prisma from '../../config/db.js';
import { Prisma } from '@prisma/client';
// Los restaurantes del owner — para los cards del dashboard
export const listarMisRestaurantes = async (ownerId) => {
  return await prisma.restaurant.findMany({
    where: { userId: ownerId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      isActive: true,
    },
  });
};


// Helper reutilizable: valida que el restaurante sea del owner.
// Lo van a usar TODOS los endpoints que reciban un :id de restaurante.
export const validarRestauranteDelOwner = async (ownerId, restaurantId) => {
  const restaurante = await prisma.restaurant.findFirst({
    where: { id: restaurantId, userId: ownerId },
  });
  if (!restaurante) throw new Error('Restaurante no encontrado o no autorizado');
  return restaurante;
};



// Resumen del día de un restaurante específico
export const resumenDiaRestaurante = async (ownerId, restaurantId) => {
  await validarRestauranteDelOwner(ownerId, restaurantId);

  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);
  const finDia = new Date();
  finDia.setHours(23, 59, 59, 999);

  const facturas = await prisma.factura.findMany({
    where: { restaurantId, anulada: false, fecha: { gte: inicioDia, lte: finDia } },
    orderBy: { numeroFactura: 'asc' },
  });

  const totalNeto = facturas.reduce((acc, f) => acc.plus(f.montoNeto), new Prisma.Decimal(0));
  const totalServicio = facturas.reduce((acc, f) => acc.plus(f.montoServicio), new Prisma.Decimal(0));

  return {
    cantidad: facturas.length,
    totalNeto,
    totalServicio,
    ingresoReal: totalNeto.minus(totalServicio),
  };
};

// Historial de cierres de un restaurante
export const cierresRestaurante = async (ownerId, restaurantId) => {
  await validarRestauranteDelOwner(ownerId, restaurantId);
  return await prisma.cierre.findMany({
    where: { restaurantId },
    orderBy: { fecha: 'desc' },
  });
};

// Facturas de un restaurante (con filtro de fecha opcional)
export const facturasRestaurante = async (ownerId, restaurantId) => {
  await validarRestauranteDelOwner(ownerId, restaurantId);
  return await prisma.factura.findMany({
    where: { restaurantId },
    include: { seccion: true },
    orderBy: { numeroFactura: 'desc' },
  });
};



export const metricasRestaurante = async (ownerId, restaurantId) => {
  await validarRestauranteDelOwner(ownerId, restaurantId);

  // 1. Productos más vendidos (top 5) — agrupa FacturaItem por producto
  const masVendidos = await prisma.facturaItem.groupBy({
    by: ['nombreProducto'],
    where: { factura: { restaurantId, anulada: false } },
    _sum: { cantidad: true },
    orderBy: { _sum: { cantidad: 'desc' } },
    take: 5,
  });

  // 2. Ventas por sección — agrupa facturas por sección
  const porSeccion = await prisma.factura.groupBy({
    by: ['seccionId'],
    where: { restaurantId, anulada: false },
    _sum: { montoNeto: true },
    _count: true,
  });

  // Traer los nombres de las secciones para acompañar los ids
  const secciones = await prisma.seccion.findMany({
    where: { restaurantId },
    select: { id: true, nombre: true },
  });
  const nombreSeccion = new Map(secciones.map((s) => [s.id, s.nombre]));

  // 3. Ventas de los últimos 7 cierres (para una línea de tendencia)
  const ultimosCierres = await prisma.cierre.findMany({
    where: { restaurantId },
    orderBy: { fecha: 'desc' },
    take: 7,
  });

  return {
    masVendidos: masVendidos.map((m) => ({
      producto: m.nombreProducto,
      cantidad: m._sum.cantidad,
    })),
    porSeccion: porSeccion.map((s) => ({
      seccion: nombreSeccion.get(s.seccionId) ?? 'Sección',
      total: s._sum.montoNeto,
      facturas: s._count,
    })),
    tendencia: ultimosCierres
      .map((c) => ({
        fecha: c.fecha,
        ingresoReal: c.ingresoReal,
      }))
      .reverse(), // del más viejo al más nuevo, para el gráfico de línea
  };
};