/*
  Warnings:

  - You are about to drop the `Categoryd` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Categoryd";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(191) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
