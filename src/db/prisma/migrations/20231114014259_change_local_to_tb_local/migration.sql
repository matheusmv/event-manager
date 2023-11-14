/*
  Warnings:

  - You are about to drop the `Local` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Local";

-- CreateTable
CREATE TABLE "tb_local" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,

    CONSTRAINT "tb_local_pkey" PRIMARY KEY ("id")
);
