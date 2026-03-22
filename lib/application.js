import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";

const UPLOAD_SUBDIR = "uploads/invoices";
const APP_CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

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
  hasInternet: toOptionalTrimmedString(raw.hasInternet),
  serviceType: toOptionalTrimmedString(raw.serviceType),
  contractPreference: toOptionalTrimmedString(raw.contractPreference),
  selectedService: toOptionalTrimmedString(raw.selectedService),
  selectedPackage: toOptionalTrimmedString(raw.selectedPackage),
  address: toOptionalTrimmedString(raw.address),
  note: toOptionalTrimmedString(raw.note),
  step: parseOptionalStep(raw.step),
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

const generateAppCode = () =>
  Array.from({ length: 6 })
    .map(() => APP_CODE_CHARSET[Math.floor(Math.random() * APP_CODE_CHARSET.length)])
    .join("");

/** Normalize for matching existing applications (name + phone). */
const normalizeNameForMatch = (name) =>
  String(name ?? "")
    .trim()
    .replace(/\s+/g, " ");

/** Digits only, 12 chars starting with 90 (Turkey). */
const normalizePhoneForMatch = (phone) => {
  const d = String(phone ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("90")) return d;
  if (d.length === 10) return `90${d}`;
  return d;
};

export {
  generateAppCode,
  normalizeDraftPayload,
  normalizeNameForMatch,
  normalizePhoneForMatch,
  saveInvoiceFileLocally,
};
