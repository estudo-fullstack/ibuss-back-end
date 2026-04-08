/*
  Warnings:

  - You are about to drop the column `route_number` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `trip_duration` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `day_of_week` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `departure_time` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_at` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_price` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `used_at` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_amount` on the `WalletTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_type` on the `WalletTransaction` table. All the data in the column will be lost.
  - Added the required column `routeNumber` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripDuration` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchasePrice` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionAmount` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionType` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "route_number",
DROP COLUMN "trip_duration",
ADD COLUMN     "routeNumber" VARCHAR(10) NOT NULL,
ADD COLUMN     "tripDuration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "day_of_week",
DROP COLUMN "departure_time",
DROP COLUMN "is_active",
ADD COLUMN     "dayOfWeek" INTEGER NOT NULL,
ADD COLUMN     "departureTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "purchase_at",
DROP COLUMN "purchase_price",
DROP COLUMN "used_at",
ADD COLUMN     "purchaseAt" TIMESTAMP(3),
ADD COLUMN     "purchasePrice" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone_number",
ADD COLUMN     "phoneNumber" VARCHAR(20) NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "WalletTransaction" DROP COLUMN "transaction_amount",
DROP COLUMN "transaction_type",
ADD COLUMN     "transactionAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "transactionType" TEXT NOT NULL;
