import prisma from '../config/db.js';
import pkg from '@prisma/client';
const { Prisma } = pkg;

function armarRango(desde, hasta) {
  const inicio = new Date(`${desde}T00:00:00.000Z`);
  const fin = new Date(`${hasta}T23:59:59.999Z`);
  return { inicio, fin };
}

function rangoHoy() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date();
  fin.setHours(23, 59, 59, 999);
  return { inicio, fin };
}

// ── Resumen del día ──
export const resumenDia = async (restaurantId) => {
  const { inicio, fin } = rangoHoy();
  const facturas = await prisma.factura.findMany({
    where: { restaurantId, anulada: false, fecha: { gte: inicio, lte: fin } },
  });
  const totalNeto = facturas.reduce((a, f) => a.plus(f.montoNeto), new Prisma.Decimal(0));
  const totalServicio = facturas.reduce((a, f) => a.plus(f.montoServicio), new Prisma.Decimal(0));
  return {
    cantidad: facturas.length,
    totalNeto,
    totalServicio,
    ingresoReal: totalNeto.minus(totalServicio),
  };
};

// ── Métricas (top productos, por sección, tendencia) ──
export const metricas = async (restaurantId, desde = null, hasta = null) => {
  // Rango: si no viene, últimos 30 días
  let inicio, fin;
  if (desde && hasta) {
    inicio = new Date(`${desde}T00:00:00.000Z`);
    fin = new Date(`${hasta}T23:59:59.999Z`);
  } else {
    fin = new Date();
    inicio = new Date();
    inicio.setDate(inicio.getDate() - 30);
  }

  const filtroFecha = { fecha: { gte: inicio, lte: fin } };

  const masVendidos = await prisma.facturaItem.groupBy({
    by: ['nombreProducto'],
    where: { factura: { restaurantId, anulada: false, ...filtroFecha } },
    _sum: { cantidad: true },
    orderBy: { _sum: { cantidad: 'desc' } },
    take: 5,
  });

  const porSeccion = await prisma.factura.groupBy({
    by: ['seccionId'],
    where: { restaurantId, anulada: false, ...filtroFecha },
    _sum: { montoNeto: true },
    _count: true,
  });

  const secciones = await prisma.seccion.findMany({
    where: { restaurantId },
    select: { id: true, nombre: true },
  });
  const nombreSeccion = new Map(secciones.map((s) => [s.id, s.nombre]));

  // Tendencia: cierres del rango, ordenados ascendente
  const cierresRango = await prisma.cierre.findMany({
    where: { restaurantId, fecha: { gte: inicio, lte: fin } },
    orderBy: { fecha: 'asc' },
  });

  return {
    masVendidos: masVendidos.map((m) => ({ producto: m.nombreProducto, cantidad: m._sum.cantidad })),
    porSeccion: porSeccion.map((s) => ({
      seccion: nombreSeccion.get(s.seccionId) ?? 'Sección',
      total: s._sum.montoNeto,
      facturas: s._count,
    })),
    tendencia: cierresRango.map((c) => ({ fecha: c.fecha, ingresoReal: c.ingresoReal })),
  };
};

// ── Cierres (historial) ──
export const cierres = async (restaurantId) => {
  return await prisma.cierre.findMany({
    where: { restaurantId },
    orderBy: { fecha: 'desc' },
  });
};

// ── Facturas (listado) ──
export const facturas = async (restaurantId) => {
  return await prisma.factura.findMany({
    where: { restaurantId },
    include: { seccion: true },
    orderBy: { numeroFactura: 'desc' },
  });
};

// ── Buscar cierre por fecha ──
export const buscarCierrePorFecha = async (restaurantId, fecha) => {
  const inicio = new Date(`${fecha}T00:00:00.000Z`);
  const fin = new Date(`${fecha}T23:59:59.999Z`);
  const dia = new Date(`${fecha}T00:00:00.000Z`);

  const [cierre, cantidadFacturas] = await Promise.all([
    prisma.cierre.findFirst({ where: { restaurantId, fecha: dia } }),
    prisma.factura.count({
      where: { restaurantId, anulada: false, fecha: { gte: inicio, lte: fin } },
    }),
  ]);

  return {
    cierre,
    hayFacturas: cantidadFacturas > 0,
  };
};

// ── Buscar factura por número ──
export const buscarFacturaPorNumero = async (restaurantId, numFactura) => {
  return await prisma.factura.findFirst({
    where: { numeroFactura: numFactura, restaurantId },
    include: { items: true, seccion: true },
  });
};

// ── 1. Ventas por rango (todo menos comisión) ──
export const ventasRango = async (restaurantId, desde, hasta) => {
  const { inicio, fin } = armarRango(desde, hasta);
  const facturas = await prisma.factura.findMany({
    where: { restaurantId, anulada: false, fecha: { gte: inicio, lte: fin } },
  });
  const subtotal = facturas.reduce((a, f) => a.plus(f.subtotal), new Prisma.Decimal(0));
  const totalServicio = facturas.reduce((a, f) => a.plus(f.montoServicio), new Prisma.Decimal(0));
  const totalNeto = facturas.reduce((a, f) => a.plus(f.montoNeto), new Prisma.Decimal(0));
  return {
    cantidadFacturas: facturas.length,
    subtotal,
    totalServicio,
    totalNeto,
    ingresoReal: totalNeto.minus(totalServicio),
  };
};

// ── 2. Impuesto de servicio por rango ──
export const servicioRango = async (restaurantId, desde, hasta) => {
  const { inicio, fin } = armarRango(desde, hasta);
  const facturas = await prisma.factura.findMany({
    where: { restaurantId, anulada: false, fecha: { gte: inicio, lte: fin } },
    select: { montoServicio: true },
  });
  const totalServicio = facturas.reduce((a, f) => a.plus(f.montoServicio), new Prisma.Decimal(0));
  return { totalServicio, cantidadFacturas: facturas.length };
};

// ── 3. Productos por categoría en rango ──
export const productosPorCategoriaRango = async (restaurantId, desde, hasta) => {
  const { inicio, fin } = armarRango(desde, hasta);
  const items = await prisma.facturaItem.findMany({
    where: { factura: { restaurantId, anulada: false, fecha: { gte: inicio, lte: fin } } },
    include: { producto: { include: { categoria: true } } },
  });

  const mapa = new Map();
  for (const item of items) {
    const cat = item.producto?.categoria?.nombre ?? 'Sin categoría';
    const prod = item.nombreProducto;
    const monto = Number(item.precioUnitario) * item.cantidad;
    if (!mapa.has(cat)) mapa.set(cat, new Map());
    const productos = mapa.get(cat);
    if (!productos.has(prod)) productos.set(prod, { producto: prod, cantidad: 0, monto: 0 });
    const acc = productos.get(prod);
    acc.cantidad += item.cantidad;
    acc.monto += monto;
  }

  return Array.from(mapa.entries()).map(([categoria, productos]) => ({
    categoria,
    productos: Array.from(productos.values()).sort((a, b) => b.cantidad - a.cantidad),
  }));
};

// ── 4. Consecutivo de facturas en rango ──
export const consecutivoRango = async (restaurantId, desde, hasta) => {
  const { inicio, fin } = armarRango(desde, hasta);
  const facturas = await prisma.factura.findMany({
    where: { restaurantId, anulada: false, fecha: { gte: inicio, lte: fin } },
    orderBy: { numeroFactura: 'asc' },
    select: { numeroFactura: true },
  });
  if (facturas.length === 0) return { primera: null, ultima: null, cantidad: 0 };
  return {
    primera: facturas[0].numeroFactura,
    ultima: facturas[facturas.length - 1].numeroFactura,
    cantidad: facturas.length,
  };
};