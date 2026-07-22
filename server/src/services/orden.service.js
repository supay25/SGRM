import prisma from "../config/db.js";

export const obtenerOrdenActivaDeMesa = async (restaurantId, mesaId) => {
    const mesa = await prisma.mesa.findFirst({
        where: { id: mesaId, restaurantId },
    });

    if (!mesa) {
        throw new Error('Mesa no encontrada');
    }

    const orden = await prisma.orden.findFirst({
        where: { mesaId, restaurantId },
        include: {
            items: {
                include: { producto: true },
            },
        },
    });

    return orden;
};



export const agregarProductoAOrden = async (restaurantId, mesaId, productoId, cantidad) => {
    // 1. Validar que la mesa exista y sea de este restaurante
    const mesa = await prisma.mesa.findFirst({
        where: { id: mesaId, restaurantId },
    });
    if (!mesa) throw new Error('Mesa no encontrada');


    // 2. Validar que el producto exista y sea de este restaurante
    const producto = await prisma.producto.findFirst({
        where: { id: productoId, restaurantId },
    })
    if (!mesa) throw new Error('Mesa no encontrada');

    // 3. Buscar si ya existe una Orden activa para esta mesa
    let orden = await prisma.orden.findFirst({
        where: { mesaId, restaurantId },
    });
    if (!orden) {
        orden = await prisma.orden.create({
            data: { mesaId, restaurantId }
        })
    }
    // 4. Si no existe, crearla
    //    TE TOCA: if (!orden) { orden = await prisma.orden.create({...}) }

    // 5. Usar upsert para agregar o incrementar el OrdenItem
    await prisma.ordenItem.upsert({
        where: {
            ordenId_productoId: { ordenId: orden.id, productoId },
        },
        update: {
            cantidad: { increment: cantidad },
        },
        create: {
            ordenId: orden.id,
            productoId,
            cantidad,
            precioUnitario: producto.precio, // ya tienes "producto" del paso 2
        },
    });

    // 6. Devolver la orden actualizada con sus items
    return obtenerOrdenActivaDeMesa(restaurantId, mesaId);
};



export const eliminarProductoOrden = async ( ordenItemId, restaurantId) => {
    const ordenItem = await prisma.ordenItem.findFirst({
        where: {
            id: ordenItemId,
            orden: { restaurantId },
        },
        include: {
            producto: true,
            orden: {
                include: {
                    mesa: true,
                },
            },
        },
    });

    if (!ordenItem) {
        throw new Error("Producto de la orden no encontrado");
    }

    const itemAnulado = await prisma.itemAnulado.create({

        data: {
            restaurantId,
            nombreMesa: ordenItem.orden.mesa.nombre,
            productoId: ordenItem.productoId,
            nombreProducto: ordenItem.producto.nombre,
            cantidad: ordenItem.cantidad,
            precioUnitario: ordenItem.precioUnitario
        },
    });
    await prisma.ordenItem.delete({
        where: { id: ordenItemId },
    });
    const restantes = await prisma.ordenItem.count({ where: { ordenId: ordenItem.ordenId } })
    if (restantes == 0) {
        await prisma.orden.delete({
            where: { id: ordenItem.ordenId}
        })
    }

     return obtenerOrdenActivaDeMesa(restaurantId, ordenItem.orden.mesaId);
};


export const vaciarOrden = async (restaurantId, mesaId) => {
  const orden = await prisma.orden.findFirst({
    where: { mesaId, restaurantId },
    include: {
      items: { include: { producto: true } },
      mesa: true,
    },
  });

  if (!orden) throw new Error('Esta mesa no tiene una orden activa');

  // Registrar cada producto como anulado, antes de borrar
  if (orden.items.length > 0) {
    await prisma.itemAnulado.createMany({
      data: orden.items.map((item) => ({
        restaurantId,
        nombreMesa: orden.mesa.nombre,
        productoId: item.productoId,
        nombreProducto: item.producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
      })),
    });
  }

  // Borra la Orden completa (onDelete: Cascade se lleva los OrdenItem con ella)
  await prisma.orden.delete({ where: { id: orden.id } });

  return { mensaje: 'Orden reiniciada correctamente' };
};



export const ingresarOrden = async (restaurantId, mesaId, itemsNuevos) => {
  // itemsNuevos = [{ productoId, cantidad }, ...] — el borrador completo del frontend

  // 1. Validar mesa
  const mesa = await prisma.mesa.findFirst({
    where: { id: mesaId, restaurantId },
  });
  if (!mesa) throw new Error('Mesa no encontrada');

  if (!itemsNuevos || itemsNuevos.length === 0) {
    throw new Error('La orden no tiene productos');
  }

  // 2. Validar TODOS los productos de una vez (más eficiente que uno por uno)
  const idsProductos = itemsNuevos.map((item) => item.productoId);
  const productos = await prisma.producto.findMany({
    where: { id: { in: idsProductos }, restaurantId },
  });

  if (productos.length !== idsProductos.length) {
    throw new Error('Uno o más productos no existen o no pertenecen a este restaurante');
  }

  // Mapa para buscar el precio de cada producto rápido: { productoId → producto }
  const mapaProductos = new Map(productos.map((p) => [p.id, p]));

  // 3. Buscar la orden existente (si la hay), con sus items actuales
  const ordenExistente = await prisma.orden.findFirst({
    where: { mesaId, restaurantId },
    include: { items: { include: { producto: true } } },
  });

  // 4. Todo lo que sigue es atómico: diff + reemplazo, o nada
  await prisma.$transaction(async (tx) => {
    if (ordenExistente) {
      // 4a. DIFF: detectar qué se quitó o bajó de cantidad, y registrarlo como anulado
      const anulados = [];

      for (const itemViejo of ordenExistente.items) {
        const itemNuevo = itemsNuevos.find((i) => i.productoId === itemViejo.productoId);
        const cantidadNueva = itemNuevo ? itemNuevo.cantidad : 0;
        const diferencia = itemViejo.cantidad - cantidadNueva;

        if (diferencia > 0) {
          anulados.push({
            restaurantId,
            nombreMesa: mesa.nombre,
            productoId: itemViejo.productoId,
            nombreProducto: itemViejo.producto.nombre,
            cantidad: diferencia,
            precioUnitario: itemViejo.precioUnitario,
          });
        }
      }

      if (anulados.length > 0) {
        await tx.itemAnulado.createMany({ data: anulados });
      }

      // 4b. Borrar los items viejos (la orden se queda, solo se vacía)
      await tx.ordenItem.deleteMany({
        where: { ordenId: ordenExistente.id },
      });

      // 4c. Insertar los items nuevos
      await tx.ordenItem.createMany({
        data: itemsNuevos.map((item) => ({
          ordenId: ordenExistente.id,
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: mapaProductos.get(item.productoId).precio,
        })),
      });
    } else {
      // 4d. No había orden: crearla con sus items anidados de una vez
      await tx.orden.create({
        data: {
          mesaId,
          restaurantId,
          items: {
            create: itemsNuevos.map((item) => ({
              productoId: item.productoId,
              cantidad: item.cantidad,
              precioUnitario: mapaProductos.get(item.productoId).precio,
            })),
          },
        },
      });
    }
  });

  // 5. Devolver la orden final actualizada
  return obtenerOrdenActivaDeMesa(restaurantId, mesaId);
};