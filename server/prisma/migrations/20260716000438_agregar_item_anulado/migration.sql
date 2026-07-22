-- CreateTable
CREATE TABLE "ItemAnulado" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "nombreMesa" TEXT NOT NULL,
    "productoId" INTEGER NOT NULL,
    "nombreProducto" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemAnulado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemAnulado" ADD CONSTRAINT "ItemAnulado_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemAnulado" ADD CONSTRAINT "ItemAnulado_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
