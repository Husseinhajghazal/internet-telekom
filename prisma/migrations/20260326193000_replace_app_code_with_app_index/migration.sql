-- Replace the old string-based `appCode` with an auto-increasing integer `appIndex`.
-- Strategy:
-- 1) Add `appIndex` (nullable) and backfill existing rows with ROW_NUMBER() ordered by `createdAt`.
-- 2) Enforce NOT NULL + unique.
-- 3) Drop `appCode`.

ALTER TABLE "Application" ADD COLUMN "appIndex" INTEGER;

WITH ordered AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, "id" ASC) AS rn
  FROM "Application"
)
UPDATE "Application" a
SET "appIndex" = ordered.rn
FROM ordered
WHERE a."id" = ordered."id";

ALTER TABLE "Application" ALTER COLUMN "appIndex" SET NOT NULL;
CREATE UNIQUE INDEX "Application_appIndex_key" ON "Application"("appIndex");

ALTER TABLE "Application" DROP COLUMN "appCode";

