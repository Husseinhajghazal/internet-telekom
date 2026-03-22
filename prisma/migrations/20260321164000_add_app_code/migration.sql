-- Add appCode as nullable first to allow backfilling existing rows safely.
ALTER TABLE "Application"
ADD COLUMN "appCode" CHAR(6);

-- Fill any existing rows with a deterministic 6-char uppercase token.
UPDATE "Application"
SET "appCode" = UPPER(SUBSTRING(MD5("id" || NOW()::text || RANDOM()::text), 1, 6))
WHERE "appCode" IS NULL;

-- Enforce required + unique constraints for future writes.
ALTER TABLE "Application"
ALTER COLUMN "appCode" SET NOT NULL;

CREATE UNIQUE INDEX "Application_appCode_key" ON "Application"("appCode");
