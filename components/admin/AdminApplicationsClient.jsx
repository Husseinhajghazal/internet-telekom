"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdCalendarMonth,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdDone,
  MdFilterList,
  MdOutlineAssignment,
  MdOutlineRefresh,
  MdOutlineTag,
  MdPerson,
  MdPhone,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import * as XLSX from "xlsx";
import AdminConfirmDialog from "./AdminConfirmDialog";
import ApplicationDetailModal from "./ApplicationDetailModal";
import {
  describeSelectedInquiry,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
  describeNoContractTechType,
  formatDate,
} from "@/utils/general";

const ACCENT = "#18a2e3";
const ACCENT_DARK = "#0d8bc9";

const STATUS_LABELS = {
  NOT_COMPLETED: "غير مكتمل",
  UNDER_REVIEW: "قيد المراجعة",
  REJECTED: "مرفوض",
  COMPLETED: "مكتمل",
};

const statusBadgeClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/60";
    case "REJECTED":
      return "bg-red-100 text-red-800 ring-1 ring-red-200/60";
    case "UNDER_REVIEW":
      return "bg-amber-100 text-amber-900 ring-1 ring-amber-200/60";
    case "NOT_COMPLETED":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200/60";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminApplicationsClient() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailApp, setDetailApp] = useState(null);
  const [actionId, setActionId] = useState(null);

  const [confirm, setConfirm] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [dateTo, setDateTo] = useState("");
  const searchFirstRun = useRef(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQ(searchInput.trim());
      if (!searchFirstRun.current) setPage(1);
      searchFirstRun.current = false;
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const buildQuery = useCallback(
    (p) => {
      const params = new URLSearchParams({ page: String(p) });
      if (debouncedQ) params.set("q", debouncedQ);
      if (statusFilter) params.set("status", statusFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      return params.toString();
    },
    [debouncedQ, statusFilter, dateFrom, dateTo],
  );

  const load = useCallback(
    async (p) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/applications?${buildQuery(p)}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json.error || "فشل التحميل");
        }
        setData(json);
      } catch (e) {
        setError(e.message || "خطأ");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [buildQuery],
  );

  useEffect(() => {
    load(page);
  }, [page, load]);

  const exportToExcel = useCallback(async () => {
    setExportLoading(true);
    try {
      const allApplications = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const query = buildQuery(currentPage);
        const res = await fetch(`/api/admin/applications?${query}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json.error || "فشل التحميل");
        }
        allApplications.push(...json.applications);
        totalPages = json.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);

      // Prepare data for Excel
      const worksheetData = [
        [
          "رقم الطلب",
          "الإسم",
          "رقم الموبايل",
          "الحالة",
          "تاريخ الإنشاء",
          "العنوان",
          "هل لديه انترنت؟",
          "نوع الطلب",
          "الباقة المختارة",
          "الخدمة المختارة",
          "الاستفسار",
          "شركة الإنترنت",
          "نوع التقنية",
          "رقم الإشتراك",
          "ملاحظة",
        ],
        ...allApplications.map((app) => [
          app.appIndex,
          app.name,
          app.phone,
          STATUS_LABELS[app.status] || app.status,
          app.createdAt ? formatDate(app.createdAt) : "",
          app.address,
          app.hasInternet ? "نعم" : "لا",
          describeServiceType(app.serviceType),
          describeSelectedPackage(app.selectedPackage),
          describeSelectedService(app.selectedService),
          describeSelectedInquiry(app.selectedInquiry),
          describeNoContractTechType(app.noContractTechType) || "—",
          app.internetCompany || "—",
          app.subscriptionNo || "—",
          app.note || "",
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "الطلبات");

      // Download the file
      XLSX.writeFile(
        workbook,
        `applications_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    } catch (e) {
      setAlertMsg(e.message || "فشل التصدير");
    } finally {
      setExportLoading(false);
    }
  }, [buildQuery]);

  const refreshDetail = async (id) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      const json = await res.json().catch(() => ({}));
      if (res.ok) setDetailApp(json);
    } catch {
      /* ignore */
    }
  };

  const updateStatus = async (id, status) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAlertMsg(json.error || "فشل التحديث");
        return;
      }
      setConfirm(null);
      await load(page);
      if (detailApp?.id === id) {
        setDetailApp(json);
      }
    } finally {
      setActionId(null);
    }
  };

  const openDetail = async (app) => {
    setDetailApp(app);
    await refreshDetail(app.id);
  };

  const applications = data?.applications ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const canChangeStatus = (status) =>
    status !== "REJECTED" && status !== "COMPLETED";

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedQ("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(debouncedQ) ||
    Boolean(statusFilter) ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <div
          className="absolute top-0 left-0 h-full w-1 rounded-r-full"
          style={{ background: ACCENT }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-2">
          <div className="flex items-start gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
              }}
            >
              <MdOutlineAssignment size={26} />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                الطلبات
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <MdOutlineTag
                    className="opacity-70"
                    style={{ color: ACCENT }}
                    size={16}
                  />
                  إجمالي: <strong className="text-gray-800">{total}</strong>
                </span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span>
                  صفحة <strong className="text-gray-800">{page}</strong> من{" "}
                  <strong className="text-gray-800">{totalPages}</strong>
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => load(page)}
              disabled={loading}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              style={{
                background: `linear-gradient(to left, ${ACCENT}, ${ACCENT_DARK})`,
              }}
            >
              <MdOutlineRefresh
                size={20}
                className={loading ? "animate-spin" : ""}
              />
              تحديث القائمة
            </button>
            <button
              type="button"
              onClick={exportToExcel}
              disabled={exportLoading}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              style={{
                background: `linear-gradient(to left, #18e32f, #12c90d)`,
              }}
            >
              <PiMicrosoftExcelLogoFill
                size={20}
                className={exportLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Search & filters */}
      <div className="rounded-3xl border border-cyan-100/80 bg-white/95 p-4 md:p-6 shadow-md shadow-cyan-500/5 text-right space-y-4">
        <div className="flex items-center gap-2 text-gray-800 font-bold">
          <MdFilterList style={{ color: ACCENT }} size={22} />
          <span>بحث وتصفية</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4">
          <div className="lg:col-span-4 relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              بحث (الإسم، رقم الطلب، الموبايل)
            </label>
            <div className="relative">
              <MdSearch
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ابحث…"
                className="w-full rounded-2xl border border-gray-200 bg-slate-50/80 py-2.5 pr-10 pl-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
                dir="rtl"
              />
            </div>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              حالة الطلب
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
            >
              <option value="">كل الحالات</option>
              <option value="NOT_COMPLETED">
                {STATUS_LABELS.NOT_COMPLETED}
              </option>
              <option value="UNDER_REVIEW">{STATUS_LABELS.UNDER_REVIEW}</option>
              <option value="REJECTED">{STATUS_LABELS.REJECTED}</option>
              <option value="COMPLETED">{STATUS_LABELS.COMPLETED}</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              من تاريخ
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              إلى تاريخ
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <div className="lg:col-span-1 flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 px-2 text-xs font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              مسح
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 flex items-center gap-3 text-red-800 text-sm">
          <MdClose className="shrink-0 text-red-600" size={22} />
          <span className="flex-1 text-right">{error}</span>
        </div>
      )}

      {loading && !data ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
          <MdOutlineRefresh
            className="animate-spin"
            size={40}
            style={{ color: ACCENT }}
          />
          <p className="font-medium">جاري تحميل الطلبات…</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-right">
              <thead>
                <tr
                  className="text-white"
                  style={{
                    background: `linear-gradient(to left, ${ACCENT_DARK}, ${ACCENT})`,
                  }}
                >
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <MdOutlineTag size={18} />
                      رقم الطلب
                    </span>
                  </th>
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <MdPerson size={18} />
                      الإسم
                    </span>
                  </th>
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <MdPhone size={18} />
                      الموبايل
                    </span>
                  </th>
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                    الحالة
                  </th>
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <MdCalendarMonth size={18} />
                      التاريخ
                    </span>
                  </th>
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap min-w-60 text-center">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="inline-flex flex-col items-center gap-2 text-gray-500">
                        <MdOutlineAssignment size={48} className="opacity-30" />
                        <span>
                          {hasActiveFilters
                            ? "لا توجد نتائج مطابقة للبحث أو التصفية"
                            : "لا توجد طلبات بعد"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map((app, idx) => (
                    <tr
                      key={app.id}
                      className={`border-b border-gray-100 transition-colors hover:bg-cyan-50/40 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td
                        className="px-3 py-3.5 font-mono font-bold tabular-nums"
                        dir="ltr"
                        style={{ color: ACCENT }}
                      >
                      {app.appIndex}
                      </td>
                      <td
                        className="px-3 py-3.5 text-gray-800 max-w-40 truncate font-medium"
                        title={app.name}
                      >
                        {app.name}
                      </td>
                      <td
                        className="px-3 py-3.5 whitespace-nowrap text-gray-700"
                        dir="ltr"
                      >
                        {app.phone}
                      </td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeClass(app.status)}`}
                        >
                          {STATUS_LABELS[app.status] || app.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap text-xs">
                        {app.createdAt
                          ? formatDate(app.createdAt)
                          : "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openDetail(app)}
                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-95"
                            style={{
                              background: `linear-gradient(to left, ${ACCENT}, ${ACCENT_DARK})`,
                            }}
                          >
                            <MdVisibility size={16} />
                            تفاصيل
                          </button>
                          <button
                            type="button"
                            disabled={
                              !canChangeStatus(app.status) ||
                              actionId === app.id
                            }
                            onClick={() =>
                              setConfirm({
                                kind: "reject",
                                appId: app.id,
                                appIndex: app.appIndex,
                              })
                            }
                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-800 transition hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <MdClose size={16} />
                            رفض
                          </button>
                          <button
                            type="button"
                            disabled={
                              !canChangeStatus(app.status) ||
                              actionId === app.id
                            }
                            onClick={() =>
                              setConfirm({
                                kind: "complete",
                                appId: app.id,
                                appIndex: app.appIndex,
                              })
                            }
                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <MdDone size={16} />
                            إتمام
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/50 disabled:opacity-40"
          >
            <MdChevronRight size={22} />
            السابق
          </button>
          <span
            className="inline-flex min-w-25 items-center justify-center rounded-2xl px-4 py-2 text-sm font-bold text-gray-700"
            style={{
              background: `linear-gradient(180deg, rgba(24,162,227,0.12), rgba(255,255,255,0.9))`,
              border: `1px solid rgba(24,162,227,0.25)`,
            }}
          >
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/50 disabled:opacity-40"
          >
            التالي
            <MdChevronLeft size={22} />
          </button>
        </div>
      )}

      {detailApp && (
        <ApplicationDetailModal
          application={detailApp}
          onClose={() => setDetailApp(null)}
        />
      )}

      <AdminConfirmDialog
        open={!!confirm}
        kind={confirm?.kind === "reject" ? "reject" : "complete"}
        title={confirm?.kind === "reject" ? "رفض الطلب؟" : "إتمام الطلب؟"}
        message={confirm ? `هل أنت متأكد؟ الطلب #${confirm.appIndex}` : ""}
        confirmLabel={confirm?.kind === "reject" ? "نعم، رفض" : "نعم، إتمام"}
        cancelLabel="إلغاء"
        loading={!!actionId && confirm && actionId === confirm.appId}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          updateStatus(
            confirm.appId,
            confirm.kind === "reject" ? "REJECTED" : "COMPLETED",
          );
        }}
      />

      <AdminConfirmDialog
        open={!!alertMsg}
        kind="alert"
        title="تعذر التحديث"
        message={alertMsg || ""}
        confirmLabel="حسناً"
        onConfirm={() => setAlertMsg(null)}
        onCancel={() => setAlertMsg(null)}
      />
    </div>
  );
}
