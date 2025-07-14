-- AlterTable
ALTER TABLE "dimensions" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN "deletedAt" DATETIME;
