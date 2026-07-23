/*
  Warnings:

  - A unique constraint covering the columns `[mesaId]` on the table `Orden` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OrdenItem_ordenId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Orden_mesaId_key" ON "Orden"("mesaId");
