import prisma from '../config/db.js';
import pkg from '@prisma/client';
const { Prisma } = pkg;
import { fechaNegocioHoy, fechaNegocioDe, rangoDelDia, fechaCierre } from '../utils/fechas.js';

export const crearFactura = async (restaurantId, mesaId, descuento = 0, nombreCliente = 'Cliente al contado') => {
  const orden = await prisma.orden.findFirst({
    where: { mesaId, restaurantId },
    include: {
      items: { include: { producto: true } },
      mesa: { include: { seccion: true } },
    },
  });

  if (!orden) throw new Error('Esta mesa no tiene una orden activa');
  if (orden.items.length === 0) throw new Error('La orden no tiene productos');

  // Bloqueo por cierre
  const cierreHoy = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: fechaCierre(fechaNegocioHoy()) },
  });
  if (cierreHoy) throw new Error('Ya se realizó el cierre del día, no se puede facturar');

  const seccion = orden.mesa.seccion;

  // Precio bruto: suma de los productos (ya con impuesto incluido)
  const precioBruto = orden.items.reduce(
    (acc, item) => acc.plus(item.precioUnitario.times(item.cantidad)),
    new Prisma.Decimal(0)
  );

  // Aplicar descuento (llega ya como monto en colones)
  const descuentoDecimal = new Prisma.Decimal(descuento || 0);
  if (descuentoDecimal.greaterThan(precioBruto)) {
    throw new Error('El descuento no puede ser mayor que el total');
  }
  const precioTotal = precioBruto.minus(descuentoDecimal);

  // El servicio se calcula sobre el total YA descontado
  const montoServicio = seccion.aplicaServicio
    ? precioTotal.times(seccion.porcentajeServicio).dividedBy(100)
    : new Prisma.Decimal(0);

  const montoComision = seccion.aplicaComision
    ? precioTotal.times(seccion.porcentajeComision).dividedBy(100)
    : new Prisma.Decimal(0);

  const total = precioTotal.minus(montoComision);
  const subtotal = total.minus(montoServicio);
  const montoNeto = total;

  // Consecutivo
  const ultimaFactura = await prisma.factura.findFirst({
    where: { restaurantId },
    orderBy: { numeroFactura: 'desc' },
  });
  const numeroFactura = ultimaFactura ? ultimaFactura.numeroFactura + 1 : 1;

  const factura = await prisma.$transaction(async (tx) => {
    const nuevaFactura = await tx.factura.create({
      data: {
        numeroFactura,
        nombreMesa: orden.mesa.nombre,
        nombreCliente: nombreCliente?.trim() || 'Cliente al contado',
        seccionId: seccion.id,
        restaurantId,
        descuento: descuentoDecimal,
        total,
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

    await tx.orden.delete({ where: { id: orden.id } });
    return nuevaFactura;
  });

  return factura;
};


export const listarFacturas = async (restaurantId) => {
  const { inicio, fin } = rangoDelDia(fechaNegocioHoy());
  return await prisma.factura.findMany({
    where: {
      restaurantId,
      fecha: { gte: inicio, lte: fin },
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
  const cierre = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: fechaCierre(fechaNegocioDe(factura.fecha)) },
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


export const editarClienteFactura = async (restaurantId, facturaId, nombreCliente) => {
  const factura = await prisma.factura.findFirst({
    where: { id: facturaId, restaurantId },
  });
  if (!factura) throw new Error('Factura no encontrada');

  return await prisma.factura.update({
    where: { id: facturaId },
    data: { nombreCliente: nombreCliente?.trim() || 'Cliente al contado' },
  });
};


export const facturarParcial = async (restaurantId, mesaId, itemsAFacturar, descuento = 0, nombreCliente = 'Cliente al contado') => {
  // itemsAFacturar = [{ productoId, cantidad }, ...] — lo que esta persona paga

  const orden = await prisma.orden.findFirst({
    where: { mesaId, restaurantId },
    include: {
      items: { include: { producto: true } },
      mesa: { include: { seccion: true } },
    },
  });

  if (!orden) throw new Error('Esta mesa no tiene una orden activa');
  if (!itemsAFacturar || itemsAFacturar.length === 0) throw new Error('No se seleccionaron productos');

  // Bloqueo por cierre
  const cierreHoy = await prisma.cierre.findFirst({
    where: { restaurantId, fecha: fechaCierre(fechaNegocioHoy()) },
  });
  if (cierreHoy) throw new Error('Ya se realizó el cierre del día, no se puede facturar');

  // Validar que cada item seleccionado exista en la orden y no exceda la cantidad disponible
  const itemsFactura = [];
  for (const sel of itemsAFacturar) {
    const itemOrden = orden.items.find((i) => i.productoId === sel.productoId);
    if (!itemOrden) throw new Error(`El producto ${sel.productoId} no está en la orden`);
    if (sel.cantidad > itemOrden.cantidad) {
      throw new Error(`No podés facturar ${sel.cantidad} de ${itemOrden.producto.nombre}, solo hay ${itemOrden.cantidad}`);
    }
    if (sel.cantidad <= 0) throw new Error('La cantidad debe ser mayor que cero');

    itemsFactura.push({
      ordenItem: itemOrden,
      cantidad: sel.cantidad,
    });
  }

  const seccion = orden.mesa.seccion;

  // Precio bruto de lo seleccionado
  const precioBruto = itemsFactura.reduce(
    (acc, x) => acc.plus(x.ordenItem.precioUnitario.times(x.cantidad)),
    new Prisma.Decimal(0)
  );

  // Descuento
  const descuentoDecimal = new Prisma.Decimal(descuento || 0);
  if (descuentoDecimal.greaterThan(precioBruto)) {
    throw new Error('El descuento no puede ser mayor que el total');
  }
  const precioTotal = precioBruto.minus(descuentoDecimal);

  // Cálculo igual que crearFactura (servicio sobre el descontado)
  const montoServicio = seccion.aplicaServicio
    ? precioTotal.times(seccion.porcentajeServicio).dividedBy(100)
    : new Prisma.Decimal(0);
  const montoComision = seccion.aplicaComision
    ? precioTotal.times(seccion.porcentajeComision).dividedBy(100)
    : new Prisma.Decimal(0);
  const total = precioTotal.minus(montoComision);
  const subtotal = total.minus(montoServicio);
  const montoNeto = total;

  // Consecutivo
  const ultimaFactura = await prisma.factura.findFirst({
    where: { restaurantId },
    orderBy: { numeroFactura: 'desc' },
  });
  const numeroFactura = ultimaFactura ? ultimaFactura.numeroFactura + 1 : 1;

  // Todo atómico: crear factura + restar de la orden (+ borrar orden si queda vacía)
  const factura = await prisma.$transaction(async (tx) => {
    const nuevaFactura = await tx.factura.create({
      data: {
        numeroFactura,
        nombreMesa: orden.mesa.nombre,
        nombreCliente: nombreCliente?.trim() || 'Cliente al contado',
        seccionId: seccion.id,
        restaurantId,
        descuento: descuentoDecimal,
        total,
        subtotal,
        montoServicio,
        montoComision,
        montoNeto,
        items: {
          create: itemsFactura.map((x) => ({
            productoId: x.ordenItem.productoId,
            nombreProducto: x.ordenItem.producto.nombre,
            cantidad: x.cantidad,
            precioUnitario: x.ordenItem.precioUnitario,
          })),
        },
      },
      include: { items: true },
    });

    // Restar lo facturado de cada OrdenItem
    for (const x of itemsFactura) {
      const restante = x.ordenItem.cantidad - x.cantidad;
      if (restante > 0) {
        await tx.ordenItem.update({
          where: { id: x.ordenItem.id },
          data: { cantidad: restante },
        });
      } else {
        await tx.ordenItem.delete({ where: { id: x.ordenItem.id } });
      }
    }

    // ¿Quedó algún item en la orden? Si no, borrar la orden (mesa libre)
    const itemsRestantes = await tx.ordenItem.count({ where: { ordenId: orden.id } });
    if (itemsRestantes === 0) {
      await tx.orden.delete({ where: { id: orden.id } });
    }

    return nuevaFactura;
  });

  return factura;
};