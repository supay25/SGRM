import prisma from '../config/db.js';
import pkg from '@prisma/client';
const { Prisma } = pkg;
import { fechaNegocioHoy, rangoDelDia, fechaCierre } from '../utils/fechas.js';

export const crearCierre = async (restaurantId, fechaStr = null) => {
  const hoy = fechaNegocioHoy();
  const fecha = fechaStr ?? hoy;   // siempre 'YYYY-MM-DD'
  const esHoy = fecha === hoy;

  if (fecha > hoy) {
    throw new Error('No se puede cerrar un día que aún no ha llegado');
  }

  // 1. ¿Ya se cerró ese día?
  const dia = fechaCierre(fecha);
  const cierreExistente = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: dia },
  });
  if (cierreExistente) throw new Error('El día ya fue cerrado');

  // 2. Validar mesas ocupadas — SOLO para el cierre de hoy
  if (esHoy) {
    const ordenesActivas = await prisma.orden.count({ where: { restaurantId } });
    if (ordenesActivas > 0) {
      throw new Error('Hay mesas con productos sin facturar. Factura o vacía todas las mesas antes de cerrar.');
    }
  }

  // 3. Traer las facturas de ese día (rango en hora del restaurante)
  const { inicio, fin } = rangoDelDia(fecha);
  const facturas = await prisma.factura.findMany({
    where: {
      restaurantId,
      anulada: false,
      fecha: { gte: inicio, lte: fin },
    },
    orderBy: { numeroFactura: 'asc' },
  });

  if (facturas.length === 0) throw new Error('No hay facturas para cerrar ese día');

  // 4. Sumar montos con Decimal
  const totalNeto = facturas.reduce((acc, f) => acc.plus(f.montoNeto), new Prisma.Decimal(0));
  const totalServicio = facturas.reduce((acc, f) => acc.plus(f.montoServicio), new Prisma.Decimal(0));
  const ingresoReal = totalNeto.minus(totalServicio);

  // 5. Rango de consecutivos
  const primeraFactura = facturas[0].numeroFactura;
  const ultimaFactura = facturas[facturas.length - 1].numeroFactura;

  // 6. Crear el cierre
  const cierre = await prisma.cierre.create({
    data: {
      restaurantId,
      fecha: dia,
      primeraFactura,
      ultimaFactura,
      totalNeto,
      totalServicio,
      ingresoReal,
    },
  });

  return cierre;
};

// Trae los datos completos de un cierre para el reporte: el cierre + los anulados de ese día
// Trae los datos completos de un cierre para el reporte: el cierre + los anulados de ese día
export const obtenerReporteCierre = async (restaurantId, cierreId) => {
  const cierre = await prisma.cierre.findFirst({
    where: { id: cierreId, restaurantId },
  });
  if (!cierre) throw new Error('Cierre no encontrado');

  // cierre.fecha viene de una columna @db.Date → medianoche UTC; la pasamos a 'YYYY-MM-DD'
  const { inicio, fin } = rangoDelDia(cierre.fecha.toISOString().slice(0, 10));

  const anulados = await prisma.itemAnulado.findMany({
    where: {
      restaurantId,
      fecha: { gte: inicio, lte: fin },
    },
  });

  return { cierre, anulados };
};



export const listarCierres = async (restaurantId) => {
  return await prisma.cierre.findMany({
    where: { restaurantId },
    orderBy: { fecha: 'desc' },
    take: 5,
  });
};





export const resumenDelDia = async (restaurantId) => {
  const fecha = fechaNegocioHoy();
  const { inicio, fin } = rangoDelDia(fecha);

  // Todas las del día (para conteo y rango de consecutivos)
  const facturas = await prisma.factura.findMany({
    where: { restaurantId, fecha: { gte: inicio, lte: fin } },
    orderBy: { numeroFactura: 'asc' },
  });

  // Solo activas para los montos
  const activas = facturas.filter((f) => !f.anulada);

  const totalNeto = activas.reduce((acc, f) => acc.plus(f.montoNeto), new Prisma.Decimal(0));
  const totalServicio = activas.reduce((acc, f) => acc.plus(f.montoServicio), new Prisma.Decimal(0));
  const ingresoReal = totalNeto.minus(totalServicio);

  const anulados = await prisma.itemAnulado.findMany({
    where: { restaurantId, fecha: { gte: inicio, lte: fin } },
  });

  const cierreHoy = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: fechaCierre(fecha) },
  });

  return {
    cantidad: facturas.length,
    primeraFactura: facturas[0]?.numeroFactura ?? null,
    ultimaFactura: facturas[facturas.length - 1]?.numeroFactura ?? null,
    totalNeto,
    totalServicio,
    ingresoReal,
    anulados,
    yaCerrado: Boolean(cierreHoy),
  };
};