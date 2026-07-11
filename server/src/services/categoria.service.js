import prisma from "../config/db.js";


export const crearCategoria = async (restaurantId, datos) => {
  const { nombre } = datos;
  return await prisma.categoria.create({
    data: { nombre, restaurantId },
  });
};

export const listarCategorias = async (restaurantId) => {
  return await prisma.categoria.findMany({
    where: { restaurantId },
  });
};


export const actualizarCategoria = async (categoriaId, restaurantId, datos) => {

    const categoriaExiste = await prisma.categoria.findFirst({
        where: { id: categoriaId, restaurantId },
    });

    if (!categoriaExiste) {
        throw new Error("Categoria no encontrada");
    }


    const { nombre} = datos;

    return await prisma.categoria.update({
        where: { id: categoriaId },
        data: {
            nombre,
        },
    });
};


export const eliminarCategoria = async(categoriaId, restaurantId)=>{

    const categoriaExiste = await prisma.categoria.findFirst({
        where: { id: categoriaId, restaurantId },
    });

    if (!categoriaExiste) {
        throw new Error("Categoria no encontrada");
    }

    return await prisma.categoria.delete({
        where: { id: categoriaId},
    });

};

