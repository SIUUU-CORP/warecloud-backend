/*
  Warnings:

  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropIndex
DROP INDEX "Order_id_customerId_itemId_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerId";

-- DropTable
DROP TABLE "Customer";

-- CreateIndex
CREATE INDEX "Order_id_itemId_idx" ON "Order"("id", "itemId");
