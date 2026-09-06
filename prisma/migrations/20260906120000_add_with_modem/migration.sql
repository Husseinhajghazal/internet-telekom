-- Whether the subscription ships with a modem ("مع مودم") or the customer supplies
-- their own ("المودم على المشترك"). Only meaningful for internet-list applications.
-- Existing rows take the default, matching the previous implicit behaviour.
ALTER TABLE "Application" ADD COLUMN "withModem" BOOLEAN NOT NULL DEFAULT true;
