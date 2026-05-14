/*
  Warnings:

  - Changed the type of `transactionType` on the `WalletTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- AlterTable
ALTER TABLE "WalletTransaction" DROP COLUMN "transactionType",
ADD COLUMN     "transactionType" "TransactionType" NOT NULL;
