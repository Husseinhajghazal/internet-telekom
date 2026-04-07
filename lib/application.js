import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";

const UPLOAD_SUBDIR = "uploads/invoices";

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
});

const ensureUploadDir = async () => {
  const dirPath = path.join(process.cwd(), "public", UPLOAD_SUBDIR);
  await mkdir(dirPath, { recursive: true });
  return dirPath;
};

const saveInvoiceFileLocally = async (file) => {
  if (!file || typeof file.arrayBuffer !== "function") return undefined;
  if (!file.type?.startsWith("image/")) {
    throw new Error("Only image uploads are supported.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const dirPath = await ensureUploadDir();
  const absolutePath = path.join(dirPath, fileName);

  await writeFile(absolutePath, bytes);
  return `/${UPLOAD_SUBDIR}/${fileName}`;
};

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

export {
  normalizeDraftPayload,
  normalizeNameForMatch,
  normalizePhoneForMatch,
  saveInvoiceFileLocally,
};
