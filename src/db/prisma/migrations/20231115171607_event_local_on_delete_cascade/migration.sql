-- DropForeignKey
ALTER TABLE "tb_event" DROP CONSTRAINT "tb_event_localId_fkey";

-- AddForeignKey
ALTER TABLE "tb_event" ADD CONSTRAINT "tb_event_localId_fkey" FOREIGN KEY ("localId") REFERENCES "tb_local"("id") ON DELETE CASCADE ON UPDATE CASCADE;
