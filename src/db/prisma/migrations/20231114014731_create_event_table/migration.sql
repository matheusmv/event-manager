-- CreateTable
CREATE TABLE "tb_event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "tb_event_pkey" PRIMARY KEY ("id")
);
