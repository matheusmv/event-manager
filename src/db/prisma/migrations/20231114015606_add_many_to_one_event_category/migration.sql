/*
  Warnings:

  - Added the required column `categoryId` to the `tb_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_event" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_event" ADD CONSTRAINT "tb_event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "tb_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
