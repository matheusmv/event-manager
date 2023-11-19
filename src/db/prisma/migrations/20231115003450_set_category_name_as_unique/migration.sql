/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tb_category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_category_name_key" ON "tb_category"("name");
