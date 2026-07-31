-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "arrivalLocation" VARCHAR(200) NOT NULL DEFAULT 'endereço',
ADD COLUMN     "departureLocation" VARCHAR(200) NOT NULL DEFAULT 'endereço';
