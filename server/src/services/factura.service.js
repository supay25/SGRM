import prisma from '../config/db.js';
import { Prisma } from '@prisma/client';


export const crearFactura = async (restaurantId, mesaId) => {
  // 1. Traer la orden activa con items+producto y la sección (vía mesa)
  const orden = await prisma.orden.findFirst({
    where: { mesaId, restaurantId },
    include: {
      items: { include: { producto: true } },
      mesa: { include: { seccion: true } },
    },
  });

  if (!orden) throw new Error('Esta mesa no tiene una orden activa');
  if (orden.items.length === 0) throw new Error('La orden no tiene productos');

  // 2. Bloqueo por cierre: no facturar si ya hay cierre de hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const cierreHoy = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: hoy },
  });
  if (cierreHoy) throw new Error('Ya se realizó el cierre del día, no se puede facturar');

  const seccion = orden.mesa.seccion;

  // 3. Subtotal con Decimal (nunca operar Decimal con +/* normales)
  const subtotal = orden.items.reduce(
    (acc, item) => acc.plus(item.precioUnitario.times(item.cantidad)),
    new Prisma.Decimal(0)
  );

  const montoServicio = seccion.aplicaServicio
    ? subtotal.times(seccion.porcentajeServicio).dividedBy(100)
    : new Prisma.Decimal(0);

  const montoComision = seccion.aplicaComision
    ? subtotal.times(seccion.porcentajeComision).dividedBy(100)
    : new Prisma.Decimal(0);

  const montoNeto = subtotal.minus(montoComision);

  // 4. Consecutivo por restaurante
  const ultimaFactura = await prisma.factura.findFirst({
    where: { restaurantId },
    orderBy: { numeroFactura: 'desc' },
  });
  const numeroFactura = ultimaFactura ? ultimaFactura.numeroFactura + 1 : 1;

  // 5. Crear factura + items (nested write), luego borrar la orden — todo atómico
  const factura = await prisma.$transaction(async (tx) => {
    const nuevaFactura = await tx.factura.create({
      data: {
        numeroFactura,
        nombreMesa: orden.mesa.nombre,
        seccionId: seccion.id,
        restaurantId,
        subtotal,
        montoServicio,
        montoComision,
        montoNeto,
        items: {
          create: orden.items.map((item) => ({
            productoId: item.productoId,
            nombreProducto: item.producto.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),
        },
      },
      include: { items: true },
    });

    // Borra la orden (cascade se lleva los OrdenItem) → mesa queda libre
    await tx.orden.delete({ where: { id: orden.id } });

    return nuevaFactura;
  });

  return factura;
};









export const listarFacturas = async (restaurantId) => {
  const inicioDia = new Date();
  const finDia = new Date();
  inicioDia.setHours(0,0,0,0);
  finDia.setHours(23,59,59, 999);
  return await prisma.factura.findMany({
    where: {
      restaurantId,
      fecha: { gte: inicioDia, lte: finDia },
    },
    include: { seccion: true },
    orderBy: { numeroFactura: 'asc' },
  });
};



export const anularFactura = async (restaurantId, facturaId) => {
  const factura = await prisma.factura.findFirst({
    where: { id: facturaId, restaurantId },
  });

  if (!factura) throw new Error('Factura no encontrada');
  if (factura.anulada) throw new Error('Esta factura ya está anulada');

  // No se puede anular una factura de un día ya cerrado
  const fechaFactura = new Date(factura.fecha);
  fechaFactura.setHours(0, 0, 0, 0);

  const cierre = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: fechaFactura },
  });
  if (cierre) throw new Error('No se puede anular: el día ya fue cerrado');

  return await prisma.factura.update({
    where: { id: facturaId },
    data: {
      anulada: true,
    },
  });
}; 



export const obtenerFactura = async (restaurantId, facturaId) => {
  const factura = await prisma.factura.findFirst({
    where: { id: facturaId, restaurantId },
    include: { items: true, seccion: true },
  });
  if (!factura) throw new Error('Factura no encontrada');
  return factura;
};