/*
  Warnings:

  - You are about to drop the column `localId` on the `tb_event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `tb_local` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `tb_local` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_event" DROP CONSTRAINT "tb_event_localId_fkey";

-- DropIndex
DROP INDEX "tb_event_localId_key";

-- AlterTable
ALTER TABLE "tb_event" DROP COLUMN "localId";

-- AlterTable
ALTER TABLE "tb_local" ADD COLUMN     "eventId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_local_eventId_key" ON "tb_local"("eventId");

-- AddForeignKey
ALTER TABLE "tb_local" ADD CONSTRAINT "tb_local_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
