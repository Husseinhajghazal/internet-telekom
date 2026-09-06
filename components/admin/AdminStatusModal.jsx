"use client";

import { STATUS_LABELS } from "@/utils/data";
import { formatBirthDate, describeStatus } from "@/utils/general";
import React, { useState } from "react";
import { MdClose, MdCalendarMonth } from "react-icons/md";

const formatDisplayDateFromIso = (value) => {
  if (!value) return "";
  return value.includes("-") ? value.split("-").reverse().join("/") : value;
};

export default function AdminStatusModal({
  application,
  onClose,
  onUpdateStatus,
  loading,
  allowedStatuses,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    application.status || "NEW",
  );
  const [delayDate, setDelayDate] = useState(
    application.delayedUntil
      ? formatDisplayDateFromIso(
          new Date(application.delayedUntil).toISOString().slice(0, 10),
        )
      : "",
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedStatus === application.status && selectedStatus !== "DELAYED") {
      onClose();
      return;
    }
    if (selectedStatus === "DELAYED") {
      onUpdateStatus(selectedStatus, delayDate || null);
    } else {
      onUpdateStatus(selectedStatus, null);
    }
  };

  const isDelayed = selectedStatus === "DELAYED";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity text-right"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-gray-900">تحديث الحالة</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
          >
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">
              الرجاء تحديد الحالة الجديدة لطلب رقم{" "}
              <span dir="ltr">#{application.appIndex}</span>
            </p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-slate-50/80 py-3 px-4 text-sm text-gray-900 font-bold outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
            >
              {Object.entries(STATUS_LABELS)
                .filter(([key]) => !allowedStatuses || allowedStatuses.includes(key))
                .map(([key]) => (
                  <option key={key} value={key}>
                    {describeStatus(key, application)}
                  </option>
                ))}
            </select>
          </div>

          {/* Delay Date Picker — shown only when DELAYED is selected */}
          {isDelayed && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="flex items-center gap-2 text-sm font-semibold text-orange-700 mb-2">
                <MdCalendarMonth size={18} />
                تاريخ التأجيل
              </label>
              <input
                type="text"
                placeholder="01/01/2026"
                dir="ltr"
                value={delayDate}
                onChange={(e) => setDelayDate(formatBirthDate(e.target.value))}
                className="w-full rounded-2xl border border-orange-200 bg-orange-50/50 py-3 px-4 text-sm text-gray-900 font-bold outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
              />
              {!delayDate && (
                <p className="text-xs text-orange-500 mt-1.5 font-medium">
                  يرجى تحديد تاريخ التأجيل
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                (selectedStatus === application.status && !isDelayed) ||
                (isDelayed && !delayDate)
              }
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "#18a2e3" }}
            >
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
