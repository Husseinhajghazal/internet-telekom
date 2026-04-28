-- CreateEnum
CREATE TYPE "WhatsappStatus" AS ENUM ('NOT_ADDED', 'ADDED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN "whatsappStatus" "WhatsappStatus" NOT NULL DEFAULT 'NOT_ADDED';
