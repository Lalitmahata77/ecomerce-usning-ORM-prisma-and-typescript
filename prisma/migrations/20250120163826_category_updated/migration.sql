/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "Categoryd" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(191) NOT NULL,

    CONSTRAINT "Categoryd_pkey" PRIMARY KEY ("id")
);
