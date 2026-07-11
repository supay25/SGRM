import prisma from '../config/db.js';

export const crearSeccion = async (restaurantId, datos) => {

    const { nombre, aplicaServicio, porcentajeServicio, aplicaComision, porcentajeComision } = datos;

    return await prisma.seccion.create({

        data: {
            nombre,
            aplicaServicio,
            porcentajeServicio,
            aplicaComision,
            porcentajeComision,
            restaurantId
        },
    });

};



export const listarSecciones = async (restaurantId) => {

    return await prisma.seccion.findMany({
        where: { restaurantId },
    });

};




export const actualizarSecciones = async (seccionId, restaurantId, datos) => {

    const seccionExiste = await prisma.seccion.findFirst({
        where: { id: seccionId, restaurantId },
    });

    if (!seccionExiste) {
        throw new Error("Sección no encontrada");
    }


    const { nombre, aplicaServicio, porcentajeServicio, aplicaComision, porcentajeComision } = datos;

    return await prisma.seccion.update({
        where: { id: seccionId },
        data: {
            nombre,
            aplicaServicio,
            porcentajeServicio,
            aplicaComision,
            porcentajeComision,
        },
    });
};


export const eliminarSeccion = async(seccionId, restaurantId)=>{

    const seccionExiste = await prisma.seccion.findFirst({
        where: { id: seccionId, restaurantId },
    });

    if (!seccionExiste) {
        throw new Error("Sección no encontrada");
    }

    return await prisma.seccion.delete({
        where: { id: seccionId},
    });

};