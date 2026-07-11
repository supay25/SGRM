// producto.service.js
import prisma from '../config/db.js';

export const crearProducto = async (restaurantId, datos) => {
    const { nombre, precio, categoriaId } = datos;

    const categoria = await prisma.categoria.findFirst({
        where: { id: categoriaId, restaurantId },
    });

    if (!categoria) {
        throw new Error('El Producto no existe o no pertenece a este restaurante');
    }

    return await prisma.producto.create({
        data: {
            nombre,
            precio,
            categoriaId,
            restaurantId,
        },
    });
};


export const listarProductos = async (restaurantId) => {
    return await prisma.producto.findMany({
        where: { restaurantId },
        include: { categoria: true }, // trae el nombre de la categoría junto con el producto
    });
};




export const actualizarProducto = async (productoId, restaurantId, datos) => {
    const productoExiste = await prisma.producto.findFirst({
        where: { id: productoId, restaurantId },
    });

    if (!productoExiste) {
        throw new Error('Producto no encontrado');
    }

    const { nombre, precio, categoriaId } = datos;

    
    if (categoriaId) {
        const categoria = await prisma.categoria.findFirst({
            where: { id: categoriaId, restaurantId },
        });

        if (!categoria) {
            throw new Error('El Producto no existe o no pertenece a este restaurante');
        }
    }

    return await prisma.producto.update({
        where: { id: productoId },
        data: { nombre, precio, categoriaId },
    });
};


export const eliminarProductos = async(productoId, restaurantId)=>{

    const productoExiste = await prisma.producto.findFirst({
        where: { id: productoId, restaurantId },
    });

    if (!productoExiste) {
        throw new Error("Producto no encontrado");
    }

    return await prisma.producto.delete({
        where: { id: productoId},
    });

};