/*
  Warnings:

  - You are about to drop the `RequestSupply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RequestSupply" DROP CONSTRAINT "RequestSupply_itemId_fkey";

-- DropForeignKey
ALTER TABLE "RequestSupply" DROP CONSTRAINT "RequestSupply_receivedVendorId_fkey";

-- DropForeignKey
ALTER TABLE "RequestSupply" DROP CONSTRAINT "RequestSupply_requestedVendorId_fkey";

-- DropTable
DROP TABLE "RequestSupply";

-- DropEnum
DROP TYPE "RequestStatus";
