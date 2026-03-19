"use client";

import React, { useEffect } from "react";

export default function ApplyError({ error, reset }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Apply route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">
          حدث خطأ في صفحة التقديم
        </h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="font-mono text-sm whitespace-pre-wrap text-red-900">
            {String(error?.message || error)}
            {"\n\n"}
            {String(error?.stack || "")}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => reset?.()}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
          >
            إعادة المحاولة
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold"
          >
            تحديث الصفحة
          </button>
        </div>
      </div>
    </div>
  );
}

