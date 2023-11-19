/*
  Warnings:

  - A unique constraint covering the columns `[localId]` on the table `tb_event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `localId` to the `tb_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_event" ADD COLUMN     "localId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_event_localId_key" ON "tb_event"("localId");

-- AddForeignKey
ALTER TABLE "tb_event" ADD CONSTRAINT "tb_event_localId_fkey" FOREIGN KEY ("localId") REFERENCES "tb_local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
