import prisma from '../config/db.js';
import { Prisma } from '@prisma/client';

export const crearCierre = async (restaurantId) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // 1. ¿Ya se cerró hoy?
  const cierreExistente = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: hoy },
  });
  if (cierreExistente) throw new Error('El día ya fue cerrado');

  // 2. Traer las facturas de hoy
  const inicioDia = new Date(hoy);
  const finDia = new Date(hoy);
  finDia.setHours(23, 59, 59, 999);

  const facturas = await prisma.factura.findMany({
    where: {
      restaurantId,
      anulada: false,
      fecha: { gte: inicioDia, lte: finDia },
    },
    orderBy: { numeroFactura: 'asc' },
  });

  if (facturas.length === 0) throw new Error('No hay facturas para cerrar hoy');

  // 3. Sumar los montos con Decimal
  const totalNeto = facturas.reduce(
    (acc, f) => acc.plus(f.montoNeto),
    new Prisma.Decimal(0)
  );
  const totalServicio = facturas.reduce(
    (acc, f) => acc.plus(f.montoServicio),
    new Prisma.Decimal(0)
  );
  const ingresoReal = totalNeto.minus(totalServicio);

  // 4. Rango de consecutivos (ya vienen ordenadas asc)
  const primeraFactura = facturas[0].numeroFactura;
  const ultimaFactura = facturas[facturas.length - 1].numeroFactura;

  // 5. Crear el cierre
  const cierre = await prisma.cierre.create({
    data: {
      restaurantId,
      fecha: hoy,
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
export const obtenerReporteCierre = async (restaurantId, cierreId) => {
  const cierre = await prisma.cierre.findFirst({
    where: { id: cierreId, restaurantId },
  });
  if (!cierre) throw new Error('Cierre no encontrado');

  // Los anulados de esa fecha (consulta aparte, Opción A)
  const inicioDia = new Date(cierre.fecha);
  const finDia = new Date(cierre.fecha);
  finDia.setHours(23, 59, 59, 999);

  const anulados = await prisma.itemAnulado.findMany({
    where: {
      restaurantId,
      fecha: { gte: inicioDia, lte: finDia },
    },
  });

  return { cierre, anulados };
};




export const listarCierres = async (restaurantId) => {
  return await prisma.cierre.findMany({
    where: { restaurantId },
    orderBy: { fecha: 'desc' },
  });
};







export const resumenDelDia = async (restaurantId) => {
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
  const ingresoReal = totalNeto.minus(totalServicio);

  const anulados = await prisma.itemAnulado.findMany({
    where: { restaurantId, fecha: { gte: inicioDia, lte: finDia } },
  });

  const cierreHoy = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: inicioDia },
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