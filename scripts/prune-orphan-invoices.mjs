/**
 * Report (and optionally delete) invoice files in public/uploads/invoices that no
 * Application row references, and flag rows pointing at files that no longer exist.
 *
 * Uploads used to be written to disk before the request was validated and were never
 * removed when an admin deleted an invoice or hard-deleted an application, so files
 * accumulated. The routes now clean up after themselves; this clears the backlog.
 *
 *   node --env-file=.env scripts/prune-orphan-invoices.mjs          # dry run
 *   node --env-file=.env scripts/prune-orphan-invoices.mjs --apply  # delete orphans
 */
import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "invoices");

const rows = await prisma.application.findMany({
  where: { invoiceFileUrl: { not: null } },
  select: { id: true, appIndex: true, invoiceFileUrl: true },
});

const referenced = new Map(); // fileName -> [appIndex]
for (const row of rows) {
  for (const url of String(row.invoiceFileUrl || "").split(",").filter(Boolean)) {
    const name = path.basename(url);
    referenced.set(name, [...(referenced.get(name) || []), row.appIndex]);
  }
}

let onDisk = [];
try {
  onDisk = await readdir(UPLOAD_DIR);
} catch {
  console.log("No upload directory yet — nothing to prune.");
  await prisma.$disconnect();
  process.exit(0);
}

const orphans = onDisk.filter((f) => !referenced.has(f));
const missing = [...referenced.entries()].filter(([f]) => !onDisk.includes(f));

let bytes = 0;
for (const f of orphans) {
  bytes += (await stat(path.join(UPLOAD_DIR, f))).size;
}

console.log(`files on disk:       ${onDisk.length}`);
console.log(`referenced by a row: ${referenced.size}`);
console.log(
  `orphaned on disk:    ${orphans.length}  (${(bytes / 1024 / 1024).toFixed(2)} MB)`,
);
console.log(`referenced but missing from disk: ${missing.length}`);

if (missing.length) {
  console.log(
    "\nThese applications link to files that are gone — the invoice will 404 in the panel:",
  );
  missing.forEach(([file, appIndexes]) =>
    console.log(`  #${appIndexes.join(", #")}  ${file}`),
  );
  console.log("  (nothing to recover automatically — re-upload if still needed)");
}

if (!orphans.length) {
  console.log("\nNo orphaned files.");
  await prisma.$disconnect();
  process.exit(0);
}

console.log("\nOrphaned files:");
orphans.forEach((f) => console.log(`  ${f}`));

if (!APPLY) {
  console.log("\nDry run — nothing deleted. Re-run with --apply to remove them.");
  await prisma.$disconnect();
  process.exit(0);
}

let deleted = 0;
for (const f of orphans) {
  try {
    await unlink(path.join(UPLOAD_DIR, f));
    deleted++;
  } catch (err) {
    console.log(`  failed to delete ${f}: ${err.message}`);
  }
}
console.log(`\nDeleted ${deleted} orphaned file(s), freeing ${(bytes / 1024 / 1024).toFixed(2)} MB.`);

await prisma.$disconnect();
