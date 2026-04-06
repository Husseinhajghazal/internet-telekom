"use client";

import React, { useEffect } from "react";
import { MdCancel, MdCheckCircle, MdWarning } from "react-icons/md";
import Button from "../Button";

const ACCENT = "#18a2e3";

/**
 * @param {'reject' | 'complete' | 'alert' | 'delete'} kind
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const isReject = kind === "reject";
  const isComplete = kind === "complete";
  const isAlert = kind === "alert";
  const isDelete = kind === "delete";

  return (
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
          className={`px-6 pt-6 pb-4 text-center ${
            isReject || isDelete
              ? "bg-linear-to-br from-red-50 to-white"
              : isComplete
                ? "bg-linear-to-br from-emerald-50 to-white"
                : "bg-linear-to-br from-cyan-50/80 to-white"
          }`}
        >
          <div className="flex justify-center mb-3">
            {(isReject || isDelete) && (
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-inner">
                {isDelete ? <MdWarning size={32} /> : <MdCancel size={32} />}
              </span>
            )}
            {isComplete && (
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
              className="flex-1 sm:flex-none min-w-[120px]"
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
            className={`min-w-[140px] ${isAlert ? "" : "flex-1 sm:flex-none min-w-[120px]"} ${
              (isReject || isDelete) ? "!bg-linear-to-r !from-red-500 !to-red-600 hover:opacity-95" : ""
            } ${isComplete ? "!bg-linear-to-r !from-emerald-600 !to-emerald-700 hover:opacity-95" : ""}`}
            style={
              !isReject && !isComplete && !isDelete
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
    </div>
  );
}
