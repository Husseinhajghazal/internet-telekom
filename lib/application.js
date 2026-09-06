import path from "path";
import { mkdir, unlink, writeFile } from "fs/promises";
import { randomUUID } from "crypto";

const UPLOAD_SUBDIR = "uploads/invoices";

/** Extensions we are willing to write. The stored name is always generated, never
 *  the client's — the client only gets to pick from this list. */
const ALLOWED_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "webp", "heic", "heif",
  "gif", "bmp", "tif", "tiff", "avif", "pdf",
]);

const MAX_UPLOAD_MB = 15;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

/** Rejection the caller should surface as a 400 rather than a generic 500. */
const uploadError = (message) => {
  const error = new Error(message);
  error.code = "INVALID_UPLOAD";
  return error;
};

const toOptionalTrimmedString = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const parseOptionalStep = (value) => {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : undefined;
};

const parseOptionalBoolean = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  return value === true || value === "true";
};

const normalizeDraftPayload = (raw) => ({
  name: toOptionalTrimmedString(raw.name),
  newName: toOptionalTrimmedString(raw.newName),
  hasInternet: toOptionalTrimmedString(raw.hasInternet),
  serviceType: toOptionalTrimmedString(raw.serviceType),
  contractPreference: toOptionalTrimmedString(raw.contractPreference),
  selectedService: toOptionalTrimmedString(raw.selectedService),
  selectedPackage: toOptionalTrimmedString(raw.selectedPackage),
  addressCode: toOptionalTrimmedString(raw.addressCode),
  newAddressCode: toOptionalTrimmedString(raw.newAddressCode),
  originalAddress: parseOptionalBoolean(raw.originalAddress),
  address: toOptionalTrimmedString(raw.address),
  newAddress: toOptionalTrimmedString(raw.newAddress),
  newPhone: toOptionalTrimmedString(raw.newPhone),
  note: toOptionalTrimmedString(raw.note),
  step: parseOptionalStep(raw.step),
  internetCompany: toOptionalTrimmedString(raw.internetCompany),
  subscriptionNo: toOptionalTrimmedString(raw.subscriptionNo),
  lastInvoiceAmount: toOptionalTrimmedString(raw.lastInvoiceAmount),
  originalAddressText: toOptionalTrimmedString(raw.originalAddressText),
  newOriginalAddress: parseOptionalBoolean(raw.newOriginalAddress),
  newOriginalAddressText: toOptionalTrimmedString(raw.newOriginalAddressText),
  selectedInquiry: toOptionalTrimmedString(raw.selectedInquiry),
  noContractTechType: toOptionalTrimmedString(raw.noContractTechType),
  electronicApproval: parseOptionalBoolean(raw.electronicApproval),
  approvalViaShipping: parseOptionalBoolean(raw.approvalViaShipping),
  paidByUserName: parseOptionalBoolean(raw.paidByUserName),
  paidByName: toOptionalTrimmedString(raw.paidByName),
  discountCount: toOptionalTrimmedString(raw.discountCount),
});

const ensureUploadDir = async () => {
  const dirPath = path.join(process.cwd(), "public", UPLOAD_SUBDIR);
  await mkdir(dirPath, { recursive: true });
  return dirPath;
};

/**
 * Pick the stored extension from the allowlist, preferring the uploaded name and
 * falling back to the MIME type. Returns null when the file is neither an image
 * nor a PDF. Never returns client-supplied text: previously the raw substring
 * after the last "." was concatenated into the path, so a name like
 * `scan.b/c` produced a write into a non-existent subdirectory (ENOENT → 500).
 */
const resolveUploadExtension = (file) => {
  const fromName = String(file.name || "")
    .toLowerCase()
    .match(/\.([a-z0-9]{1,5})$/)?.[1];
  if (fromName && ALLOWED_EXTENSIONS.has(fromName)) return fromName;

  const type = String(file.type || "").toLowerCase();
  if (type === "application/pdf") return "pdf";
  if (type.startsWith("image/")) {
    const fromType = type.slice("image/".length).replace("jpeg", "jpg");
    return ALLOWED_EXTENSIONS.has(fromType) ? fromType : "jpg";
  }
  return null;
};

const saveInvoiceFileLocally = async (file) => {
  if (!file || typeof file.arrayBuffer !== "function") return undefined;

  const extension = resolveUploadExtension(file);
  if (!extension) {
    throw uploadError("يُقبل رفع الصور وملفات PDF فقط.");
  }
  if (typeof file.size === "number" && file.size > MAX_UPLOAD_BYTES) {
    throw uploadError(`حجم الملف أكبر من ${MAX_UPLOAD_MB} ميغابايت.`);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  // `size` is client-reported; check the bytes we actually received too.
  if (bytes.length > MAX_UPLOAD_BYTES) {
    throw uploadError(`حجم الملف أكبر من ${MAX_UPLOAD_MB} ميغابايت.`);
  }

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const dirPath = await ensureUploadDir();
  const absolutePath = path.join(dirPath, fileName);

  await writeFile(absolutePath, bytes);
  return `/${UPLOAD_SUBDIR}/${fileName}`;
};

/**
 * Best-effort removal of stored invoice files. Never throws — a missing file must
 * not fail the request that triggered the cleanup. Only paths inside the invoice
 * upload directory are touched, so a crafted URL cannot reach other files.
 */
const deleteInvoiceFiles = async (urls) => {
  const list = Array.isArray(urls) ? urls : [];
  await Promise.all(
    list.map(async (url) => {
      const value = String(url || "");
      if (!value.startsWith(`/${UPLOAD_SUBDIR}/`)) return;
      const fileName = path.basename(value);
      if (!fileName || fileName === "." || fileName === "..") return;
      try {
        await unlink(path.join(process.cwd(), "public", UPLOAD_SUBDIR, fileName));
      } catch {
        // Already gone, or never written — nothing to clean up.
      }
    }),
  );
};

/** Split a stored comma-separated invoiceFileUrl into a clean list. */
const parseInvoiceFileUrls = (value) =>
  String(value || "")
    .split(",")
    .filter(Boolean);

/** Normalize for matching existing applications (name + phone). */
const normalizeNameForMatch = (name) =>
  String(name ?? "")
    .trim()
    .replace(/\s+/g, " ");

/** Digits only, 12 chars starting with 90 (Turkey). */
const normalizePhoneForMatch = (value) => {
  let formatted = value.replace(/\D/g, "");
  if (formatted.startsWith("90")) {
    formatted = formatted.substring(2);
  }
  if (formatted.startsWith("0")) {
    formatted = formatted.substring(1);
  }
  if (formatted.length > 10) {
    formatted = formatted.substring(0, 10);
  }
  let display = "0 ";
  if (formatted.length > 0) {
    display += `(${formatted.substring(0, 3)}`;
  }
  if (formatted.length > 3) {
    display += `) ${formatted.substring(3, 6)}`;
  }
  if (formatted.length > 6) {
    display += ` ${formatted.substring(6, 8)}`;
  }
  if (formatted.length > 8) {
    display += ` ${formatted.substring(8, 10)}`;
  }
  return display;
};

/**
 * `withModem` defaults to true in the schema, so — unlike the other booleans on this
 * model — an absent value must stay `undefined` and be stripped from the payload, not
 * coerced to false. Coercing would silently flip the field to "المودم على المشترك" on
 * every create or update that does not send it.
 */
const parseWithModem = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  return value === "true" || value === true;
};

const diffApplication = (oldData, newData) => {
  const changes = {};
  const ignoreFields = ["updatedAt", "lastUpdatedBy", "step", "adminNoteViewed"];

  for (const key in newData) {
    if (ignoreFields.includes(key)) continue;
    if (!(key in oldData) && newData[key] === undefined) continue;

    let oldVal = oldData[key];
    let newVal = newData[key];

    // Convert dates to string for comparison
    if (oldVal instanceof Date) oldVal = oldVal.toISOString();
    if (newVal instanceof Date) newVal = newVal.toISOString();

    // Check if truly different
    const isBothEmpty = (v) => v === null || v === undefined || v === "";
    if (isBothEmpty(oldVal) && isBothEmpty(newVal)) continue;

    if (oldVal !== newVal) {
      changes[key] = {
        old: oldVal ?? null,
        new: newVal ?? null,
      };
    }
  }
  return Object.keys(changes).length > 0 ? changes : null;
};

export {
  normalizeDraftPayload,
  normalizeNameForMatch,
  normalizePhoneForMatch,
  saveInvoiceFileLocally,
  deleteInvoiceFiles,
  parseInvoiceFileUrls,
  diffApplication,
  parseWithModem,
  MAX_UPLOAD_MB,
};
