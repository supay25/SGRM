/*
  Warnings:

  - A unique constraint covering the columns `[ordenId,productoId]` on the table `OrdenItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrdenItem_ordenId_productoId_key" ON "OrdenItem"("ordenId", "productoId");
