"use client";

import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const STATUS_LABELS = {
  NEW: "جديد",
  UNDER_REVIEW: "قيد المراجعة",
  UNDER_OBSERVATION: "قيد المتابعة",
  DELAYED: "مؤجل",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  NOT_COMPLETED: "غير مكتمل",
};

const statusBadgeClass = (status) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100/80 text-blue-800 ring-1 ring-blue-200";
    case "COMPLETED":
      return "bg-emerald-100/80 text-emerald-900 ring-1 ring-emerald-200/60";
    case "REJECTED":
      return "bg-red-100/80 text-red-800 ring-1 ring-red-200/60";
    case "UNDER_REVIEW":
      return "bg-amber-100/80 text-amber-900 ring-1 ring-amber-200/60";
    case "UNDER_OBSERVATION":
      return "bg-purple-100/80 text-purple-900 ring-1 ring-purple-200/60";
    case "DELAYED":
      return "bg-orange-100/80 text-orange-900 ring-1 ring-orange-200/60";
    case "NOT_COMPLETED":
      return "bg-slate-100/80 text-slate-700 ring-1 ring-slate-200/60";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminStatusModal({ application, onClose, onUpdateStatus, loading }) {
  const [selectedStatus, setSelectedStatus] = useState(application.status || "NEW");

  const handeSave = (e) => {
    e.preventDefault();
    if (selectedStatus === application.status) {
      onClose();
      return;
    }
    onUpdateStatus(selectedStatus);
  };

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
          <h3 className="text-xl font-extrabold text-gray-900">
            تحديث الحالة
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
          >
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handeSave} className="p-6 space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">
              الرجاء تحديد الحالة الجديدة لطلب رقم <span dir="ltr">#{application.appIndex}</span>
            </p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-slate-50/80 py-3 px-4 text-sm text-gray-900 font-bold outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
            >
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

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
              disabled={loading || selectedStatus === application.status}
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
