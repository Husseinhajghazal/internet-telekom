"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdCancel, MdCheckCircle, MdWarning, MdRestore, MdSend } from "react-icons/md";
import Button from "../Button";

const ACCENT = "#18a2e3";

/**
 * @param {'reject' | 'activate' | 'promote' | 'alert' | 'delete' | 'restore'} kind
 */
export default function AdminConfirmDialog({
  open,
  kind = "alert",
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || !mounted) return null;

  const isReject = kind === "reject";
  const isActivate = kind === "activate";
  const isPromote = kind === "promote";
  const isAlert = kind === "alert";
  const isDelete = kind === "delete";
  const isRestore = kind === "restore";

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => !loading && onCancel?.()}
        aria-hidden
      />
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div
          className={`px-6 pt-6 pb-4 text-center relative overflow-hidden ${
            isReject || isDelete
              ? "bg-linear-to-br from-red-50 to-white"
              : isActivate
                ? "bg-linear-to-br from-emerald-50 to-white"
                : isRestore
                  ? "bg-linear-to-br from-indigo-50/80 to-white"
                  : "bg-linear-to-br from-cyan-50/80 to-white"
          }`}
        >
          <div className="flex justify-center mb-3">
            {(isReject || isDelete) && (
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-inner">
                {isDelete ? <MdWarning size={32} /> : <MdCancel size={32} />}
              </span>
            )}
            {isActivate && (
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
                <MdCheckCircle size={32} />
              </span>
            )}
            {isAlert && (
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner text-white"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, #0d8bc9)`,
                }}
              >
                <MdWarning size={28} />
              </span>
            )}
            {isPromote && (
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner text-white"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, #0d8bc9)`,
                }}
              >
                <MdSend size={28} />
              </span>
            )}
            {isRestore && (
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner text-white !bg-gradient-to-r !from-indigo-600 !to-purple-600 "
              >
                <MdRestore size={28} />
              </span>
            )}
          </div>
          <h3 id="confirm-title" className="text-lg font-extrabold text-gray-900">
            {title}
          </h3>
          {message && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{message}</p>}
        </div>

        <div
          className={`flex gap-2 p-4 bg-gray-50/80 border-t border-gray-100 ${
            isAlert ? "justify-center" : "flex-col-reverse sm:flex-row sm:justify-center sm:gap-3"
          }`}
        >
          {!isAlert && (
            <Button
              type="button"
              variant="secondary"
              size="large"
              className="flex-1 sm:flex-none min-w-[120px] !from-gray-100 !to-gray-200 !text-gray-700 hover:!from-gray-200 hover:!to-gray-300 !shadow-sm focus:!ring-gray-300"
              disabled={loading}
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            size="large"
            className={`min-w-[140px] font-bold ${isAlert ? "" : "flex-1 sm:flex-none min-w-[120px]"} ${
              (isReject || isDelete) ? "!bg-linear-to-r !from-red-500 !to-red-600 hover:opacity-95" : ""
            } ${isActivate ? "!bg-linear-to-r !from-emerald-600 !to-emerald-700 hover:opacity-95" : ""} ${
              isRestore ? "!bg-gradient-to-r !from-indigo-600 !to-purple-600 !border-0 hover:scale-[1.03] shadow-lg shadow-indigo-500/25 transition-all" : ""
            }`}
            style={
              !isReject && !isActivate && !isDelete && !isRestore
                ? { background: `linear-gradient(to right, ${ACCENT}, #0d8bc9)` }
                : undefined
            }
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "جاري التنفيذ…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
