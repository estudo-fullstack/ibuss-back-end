/*
  Warnings:

  - The `status` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RouteStatusType" AS ENUM ('ACTIVE', 'SUSPENDED', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "TicketStatusType" AS ENUM ('ACTIVE', 'USED', 'CANCELED');

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "status" "RouteStatusType" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "status",
ADD COLUMN     "status" "TicketStatusType" NOT NULL DEFAULT 'ACTIVE';
