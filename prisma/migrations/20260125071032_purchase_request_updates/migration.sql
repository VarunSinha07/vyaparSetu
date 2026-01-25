-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "preferredVendorId" TEXT,
ADD COLUMN     "rejectionReason" TEXT;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_preferredVendorId_fkey" FOREIGN KEY ("preferredVendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
