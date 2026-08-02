/**
 * Backfill Application.serviceType for rows that hold no usable value.
 *
 * A row whose serviceType is NULL, "" or an unrecognised value matched neither
 * the /panel (internet) nor the /panel/services list condition, so it was saved
 * successfully and then became unreachable in the panel. The list route now
 * routes such rows to the internet list, but their data is still unclassified —
 * this script gives each one a real type inferred from the fields the customer
 * or the admin already filled in.
 *
 *   node --env-file=.env scripts/backfill-service-type.mjs          # dry run
 *   node --env-file=.env scripts/backfill-service-type.mjs --apply  # write
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

const KNOWN_SERVICE_TYPES = ["newline", "services", "inquiry"];
const INTERNET_SELECTED_SERVICES = ["upgrade", "shurn", "shurn-turknet"];

/**
 * Infer a type from whatever the row already carries. Ordered most- to
 * least-specific; falls back to "newline", the default the panel already uses
 * for unclassified rows elsewhere.
 */
const inferServiceType = (app) => {
  if (app.selectedInquiry) return ["inquiry", "has selectedInquiry"];
  if (app.selectedService) {
    return INTERNET_SELECTED_SERVICES.includes(app.selectedService)
      ? ["services", `selectedService=${app.selectedService} (internet list)`]
      : ["services", `selectedService=${app.selectedService}`];
  }
  if (app.contractPreference)
    return ["newline", `contractPreference=${app.contractPreference}`];
  if (app.selectedPackage) return ["newline", "has selectedPackage"];
  if (app.noContractTechType) return ["newline", "has noContractTechType"];
  if (app.internetCompany) return ["newline", `internetCompany=${app.internetCompany}`];
  return ["newline", "no signal — default"];
};

const rows = await prisma.$queryRaw`
  SELECT "id", "appIndex", "status"::text AS status, "serviceType", "selectedService",
         "selectedInquiry", "contractPreference", "selectedPackage",
         "noContractTechType", "internetCompany", "name", "isDeleted"
  FROM "Application"
  WHERE "serviceType" IS NULL
     OR "serviceType" NOT IN ('newline','services','inquiry')
  ORDER BY "appIndex"
`;

if (!rows.length) {
  console.log("Nothing to backfill — every application has a known serviceType.");
  await prisma.$disconnect();
  process.exit(0);
}

console.log(
  `${rows.length} application(s) with an unusable serviceType${APPLY ? "" : "  (dry run — pass --apply to write)"}\n`,
);

const plan = rows.map((app) => {
  const [serviceType, reason] = inferServiceType(app);
  return { app, serviceType, reason };
});

console.table(
  plan.map(({ app, serviceType, reason }) => ({
    appIndex: app.appIndex,
    status: app.status,
    deleted: app.isDeleted,
    from: JSON.stringify(app.serviceType),
    to: serviceType,
    why: reason,
  })),
);

const tally = plan.reduce((acc, p) => {
  acc[p.serviceType] = (acc[p.serviceType] || 0) + 1;
  return acc;
}, {});
console.log("\nresulting types:", tally);

if (!APPLY) {
  console.log("\nDry run — nothing written. Re-run with --apply to persist.");
  await prisma.$disconnect();
  process.exit(0);
}

await prisma.$transaction(
  plan.map(({ app, serviceType }) =>
    prisma.application.update({
      where: { id: app.id },
      data: { serviceType },
    }),
  ),
);

console.log(`\nUpdated ${plan.length} application(s).`);

const leftover = await prisma.application.count({
  where: {
    OR: [{ serviceType: null }, { serviceType: { notIn: KNOWN_SERVICE_TYPES } }],
  },
});
console.log(`Remaining unclassified: ${leftover}`);

await prisma.$disconnect();
