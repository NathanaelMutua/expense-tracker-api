-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "expense_update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
