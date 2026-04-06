"use client";

import React, { useState } from "react";
import { MdClose } from "react-icons/md";

export default function AdminCustomerNoteModal({ application, onClose, onUpdateAdminNote, loading }) {
  const [adminNote, setAdminNote] = useState(application.adminNote || "");

  const handleSave = (e) => {
    e.preventDefault();
    if (adminNote === (application.adminNote || "")) {
      onClose();
      return;
    }
    onUpdateAdminNote(adminNote || null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity text-right"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-gray-900">
            تحديث ملاحظة المشترك
          </h3>
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
              هذه الملاحظة ستظهر للمشترك عند الاستعلام عن حالة الطلب رقم <span dir="ltr">#{application.appIndex}</span>.
            </p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={4}
              placeholder="اكتب رسالة تنبيه للمشترك هنا..."
              className="w-full rounded-2xl border border-cyan-200 bg-cyan-50/50 py-3 px-4 text-sm text-gray-900 font-medium outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 resize-none"
            />
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
              disabled={loading || adminNote === (application.adminNote || "")}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "#18a2e3" }}
            >
              {loading ? "جاري الحفظ..." : "حفظ الملاحظة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
