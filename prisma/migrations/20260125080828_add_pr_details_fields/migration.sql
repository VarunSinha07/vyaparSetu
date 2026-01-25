-- CreateEnum
CREATE TYPE "PRPriority" AS ENUM ('NORMAL', 'URGENT');

-- CreateEnum
CREATE TYPE "BudgetCategory" AS ENUM ('CAPEX', 'OPEX');

-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "budgetCategory" "BudgetCategory",
ADD COLUMN     "priority" "PRPriority" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "requiredBy" TIMESTAMP(3);
