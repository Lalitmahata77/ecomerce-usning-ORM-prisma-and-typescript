/*
  Warnings:

  - You are about to drop the column `barnd` on the `Product` table. All the data in the column will be lost.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "barnd",
ADD COLUMN     "brand" TEXT NOT NULL;
