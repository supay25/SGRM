// mesa.service.js
import prisma from '../config/db.js';

export const crearMesa = async (restaurantId, datos) => {
    const { nombre, seccionId } = datos;
    const seccionIdNum = Number(seccionId);

    const seccion = await prisma.seccion.findFirst({
        where: { id: seccionIdNum, restaurantId },
    });

    if (!seccion) {
        throw new Error('La sección no existe o no pertenece a este restaurante');
    }

    return await prisma.mesa.create({
        data: {
            nombre,
            seccionId: seccionIdNum,
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
    const { nombre, seccionId } = datos;

    const mesa = await prisma.mesa.findFirst({
        where: { id: mesaId, restaurantId },
    });
    if (!mesa) throw new Error('Mesa no encontrada');

    // Si viene seccionId, validar que la sección sea del restaurante
    const data = { nombre };
    if (seccionId !== undefined) {
        const seccionIdNum = Number(seccionId);
        const seccion = await prisma.seccion.findFirst({
            where: { id: seccionIdNum, restaurantId },
        });
        if (!seccion) throw new Error('La sección no existe o no pertenece a este restaurante');
        data.seccionId = seccionIdNum;
    }

    return await prisma.mesa.update({
        where: { id: mesaId },
        data,
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

export const obtenerMesa = async (mesaId, restaurantId) => {
    const mesa = await prisma.mesa.findFirst({
        where: { id: mesaId, restaurantId },
        include: { seccion: true },
    });
    if (!mesa) throw new Error('Mesa no encontrada');
    return mesa;
};