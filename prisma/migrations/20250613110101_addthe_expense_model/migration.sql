-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "expense_amount" INTEGER NOT NULL,
    "expense_description" TEXT NOT NULL,
    "expense_category" TEXT NOT NULL,
    "date_filed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expense_creation_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);
