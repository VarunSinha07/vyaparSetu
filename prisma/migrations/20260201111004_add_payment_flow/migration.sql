/*
  Warnings:

  - The values [PENDING,PAID,PARTIAL] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `initiatedById` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "InvoiceStatus" ADD VALUE 'PAID';

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('INITIATED', 'SUCCESS', 'FAILED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'INITIATED';
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "initiatedById" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'INITIATED';

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_initiatedById_fkey" FOREIGN KEY ("initiatedById") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
