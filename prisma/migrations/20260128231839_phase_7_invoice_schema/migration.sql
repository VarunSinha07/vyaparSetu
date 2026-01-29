/*
  Warnings:

  - The values [PENDING_VERIFICATION] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[purchaseOrderId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileUrl` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedById` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('UPLOADED', 'UNDER_VERIFICATION', 'VERIFIED', 'MISMATCH', 'REJECTED');
ALTER TABLE "public"."Invoice" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Invoice" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "public"."InvoiceStatus_old";
ALTER TABLE "Invoice" ALTER COLUMN "status" SET DEFAULT 'UPLOADED';
COMMIT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "uploadedById" TEXT NOT NULL,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedById" TEXT,
ALTER COLUMN "status" SET DEFAULT 'UPLOADED';

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_purchaseOrderId_key" ON "Invoice"("purchaseOrderId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
