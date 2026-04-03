"use client";

import React, { useState } from "react";
import { MdClose, MdOutlineAdd, MdPerson, MdAccessTime } from "react-icons/md";
import { formatDate } from "@/utils/general";

const ACCENT = "#18a2e3";

export default function AdminNotesModal({ application, onClose, onNoteAdded }) {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState("");
  const [adminName, setAdminName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const notes = application?.notes || [];

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    if (!text.trim() || !adminName.trim()) {
      setError("الرجاء إدخال الملاحظة والاسم");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application.id,
          text,
          adminName,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "فشل الحفظ");
      }

      const newNote = await res.json();
      setIsAdding(false);
      setText("");
      // keep adminName for next note just in case
      if (onNoteAdded) {
        onNoteAdded(newNote); // parent can update state
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 text-right">
              ملاحظات الطلب
            </h3>
            <p className="text-xs text-gray-500 font-medium text-right mt-1">
              رقم الطلب: <span className="text-[#18a2e3]" dir="ltr">#{application.appIndex}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-right">
          {notes.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              لا توجد ملاحظات سابقة لهذا الطلب.
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-gray-800 font-semibold mb-3 whitespace-pre-wrap break-words break-all leading-relaxed">{note.text}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5" dir="ltr">
                    <MdAccessTime size={14} />
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-700 font-bold bg-cyan-100 px-2 py-1 rounded-md">
                    <span>{note.adminName}</span>
                    <MdPerson size={14} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Note Button / Form */}
        <div className="shrink-0 border-t border-gray-100 p-6 bg-white">
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-cyan-50 text-cyan-700 py-3 text-sm font-bold shadow-sm hover:bg-cyan-100 transition"
            >
              <MdOutlineAdd size={20} />
              إضافة ملاحظة جديدة
            </button>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 text-right">
              {error && (
                <div className="text-red-600 text-xs font-bold">{error}</div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الملاحظة</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 p-3 text-sm text-gray-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 resize-none h-24"
                  placeholder="اكتب ملاحظتك هنا..."
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الإسم</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 p-3 text-sm text-gray-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="اسم الموظف أو الإداري"
                  dir="rtl"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: ACCENT }}
                >
                  {saving ? "جاري الحفظ..." : "حفظ الملاحظة"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
