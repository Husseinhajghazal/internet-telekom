-- Backfill: rows that were "COMPLETED" under the old semantics
-- (meaning fully done) become "ACTIVATED" under the new semantics.
-- Their existing completedAt timestamp now represents the activation date.

UPDATE "Application"
SET "status" = 'ACTIVATED'
WHERE "status" = 'COMPLETED';
