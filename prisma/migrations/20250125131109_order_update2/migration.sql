/*
  Warnings:

  - The `paymentId` column on the `PaymentResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PaymentResult" DROP COLUMN "paymentId",
ADD COLUMN     "paymentId" INTEGER;
