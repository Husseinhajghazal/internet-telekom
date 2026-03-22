-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NOT_COMPLETED', 'UNDER_REVIEW', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NOT_COMPLETED',
    "step" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "hasInternet" TEXT,
    "serviceType" TEXT,
    "contractPreference" TEXT,
    "selectedService" TEXT,
    "selectedPackage" TEXT,
    "address" TEXT,
    "note" TEXT,
    "invoiceFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
