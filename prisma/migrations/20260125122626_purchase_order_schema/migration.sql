/*
  Warnings:

  - Added the required column `createdById` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "POStatus" AS ENUM ('DRAFT', 'ISSUED', 'CANCELLED');

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "issuedAt" TIMESTAMP(3),
ADD COLUMN     "issuedById" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "POStatus" NOT NULL DEFAULT 'DRAFT';

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
