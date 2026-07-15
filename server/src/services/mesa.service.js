// producto.service.js
import prisma from '../config/db.js';

export const crearMesa = async (restaurantId, datos) => {
    const { nombre, seccionId } = datos;

    const seccion = await prisma.seccion.findFirst({
        where: { id: seccionId, restaurantId },
    });

    if (!seccion) {
        throw new Error('La sección no existe o no pertenece a este restaurante');
    }

    return await prisma.mesa.create({
        data: {
            nombre,
            seccionId,
            restaurantId,
        },
    });
};


export const listarMesas = async (restaurantId) => {
    const mesas = await prisma.mesa.findMany({
        where: { restaurantId },
        include: { ordenes: true },
    });

    return mesas.map((mesa) => {
        const { ordenes, ...resto } = mesa;
        return {
            ...resto,
            estado: ordenes.length > 0 ? 'OCUPADA' : 'LIBRE',
        };
    });
};



export const actualizarMesa = async (mesaId, restaurantId, datos) => {
    const mesaExiste = await prisma.mesa.findFirst({
        where: { id: mesaId, restaurantId },
    });

    if (!mesaExiste) {
        throw new Error('Mesa no encontrada');
    }

    const { nombre, seccionId } = datos;


    if (seccionId) {
        const seccion = await prisma.seccion.findFirst({
            where: { id: seccionId, restaurantId },
        });

        if (!seccion) {
            throw new Error('La sección no existe o no pertenece a este restaurante');
        }
    }

    return await prisma.mesa.update({
        where: { id: mesaId },
        data: { nombre, seccionId },
    });
};




export const eliminarMesa = async (mesaId, restaurantId) => {

    const mesaExiste = await prisma.mesa.findFirst({
        where: { id: mesaId, restaurantId },
    });

    if (!mesaExiste) {
        throw new Error("Mesa no encontrada");
    }

    return await prisma.mesa.delete({
        where: { id: mesaId },
    });

};