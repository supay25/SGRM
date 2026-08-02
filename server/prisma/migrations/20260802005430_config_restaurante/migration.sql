-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "cedulaJuridica" TEXT,
ADD COLUMN     "tipoCambioDolar" DECIMAL(10,2) NOT NULL DEFAULT 0;
