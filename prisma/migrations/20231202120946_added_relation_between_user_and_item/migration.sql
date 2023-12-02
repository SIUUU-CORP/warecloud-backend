/*
  Warnings:

  - You are about to drop the column `vendorId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Item_id_vendorId_idx";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "vendorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Item_id_userId_idx" ON "Item"("id", "userId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
