-- Add ACTIVATED to ApplicationStatus enum.
-- Postgres requires ALTER TYPE ... ADD VALUE to commit before the new value
-- can be used in DML, so the backfill of old COMPLETED rows lives in a
-- separate, follow-up migration.

ALTER TYPE "ApplicationStatus" ADD VALUE 'ACTIVATED';
