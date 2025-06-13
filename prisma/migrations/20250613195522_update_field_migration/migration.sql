-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "expense_update_time" DROP NOT NULL,
ALTER COLUMN "expense_update_time" DROP DEFAULT;
