import prisma from '../config/db.js';
import pkg from '@prisma/client';
const { Prisma } = pkg;
export const crearCierre = async (restaurantId, fechaStr = null) => {
  const esHoy = !fechaStr;

  // Día a cerrar: hoy si no viene fecha, o la fecha dada
  let dia;
  if (esHoy) {
    dia = new Date();
    dia.setHours(0, 0, 0, 0);
  } else {
    dia = new Date(`${fechaStr}T00:00:00.000Z`);
  }


  const hoyInicio = new Date();
  hoyInicio.setUTCHours(0, 0, 0, 0);
  if (dia > hoyInicio) {
    throw new Error('No se puede cerrar un día que aún no ha llegado');
  }

  // 1. ¿Ya se cerró ese día?
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

  // 3. Traer las facturas de ese día
  const inicioDia = new Date(dia);
  const finDia = new Date(dia);
  if (esHoy) {
    finDia.setHours(23, 59, 59, 999);
  } else {
    finDia.setUTCHours(23, 59, 59, 999);
  }

  const facturas = await prisma.factura.findMany({
    where: {
      restaurantId,
      anulada: false,
      fecha: { gte: inicioDia, lte: finDia },
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
    take: 5,
  });
};





export const resumenDelDia = async (restaurantId) => {
  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);
  const finDia = new Date();
  finDia.setHours(23, 59, 59, 999);

  // Todas las del día (para conteo y rango de consecutivos)
  const facturas = await prisma.factura.findMany({
    where: { restaurantId, fecha: { gte: inicioDia, lte: finDia } },
    orderBy: { numeroFactura: 'asc' },
  });

  // Solo activas para los montos
  const activas = facturas.filter((f) => !f.anulada);

  const totalNeto = activas.reduce((acc, f) => acc.plus(f.montoNeto), new Prisma.Decimal(0));
  const totalServicio = activas.reduce((acc, f) => acc.plus(f.montoServicio), new Prisma.Decimal(0));
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