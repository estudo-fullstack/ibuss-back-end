/*
  Warnings:

  - Made the column `purchaseAt` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "usedAt" TIMESTAMP(3),
ALTER COLUMN "purchaseAt" SET NOT NULL;
