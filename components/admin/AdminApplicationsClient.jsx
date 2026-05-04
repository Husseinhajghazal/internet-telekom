"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
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
  MdMoreVert,
  MdOutlineSpeakerNotes,
  MdSwapHoriz,
  MdDoneAll,
  MdOutlineTaskAlt,
  MdOutlineTimer,
  MdAdd,
  MdDelete,
  MdHistory,
  MdSend,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { TiEdit } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import * as XLSX from "xlsx";
import AdminConfirmDialog from "./AdminConfirmDialog";
import ApplicationDetailModal from "./ApplicationDetailModal";
import AdminNotesModal from "./AdminNotesModal";
import AdminStatusModal from "./AdminStatusModal";
import AdminCustomerNoteModal from "./AdminCustomerNoteModal";
import { formatDate, describeStatus, statusBadgeClass } from "@/utils/general";
import { STATUS_LABELS } from "@/utils/data";
import { useRouter } from "next/navigation";

const ACCENT = "#18a2e3";
const ACCENT_DARK = "#0d8bc9";

const formatIsoDateFromDisplay = (value) => {
  if (!value) return "";
  const parts = value.split("/");
  if (parts.length !== 3) return "";

  const [day, month, year] = parts;
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return "";

  return `${year}-${month}-${day}`;
};

const ActionMenu = ({
  app,
  openDetail,
  setConfirm,
  canChangeStatus,
  actionId,
  openStatusModal,
  openCustomerNoteModal,
  isDeletedMode,
  isAddedMode,
  isExpiringMode,
  userRole,
  handleSendReviewLink,
  handleOpenWhatsApp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = isDeletedMode
        ? userRole === "ADMIN"
          ? 200
          : 120
        : isAddedMode
          ? userRole === "ADMIN"
            ? 380
            : 280
          : isExpiringMode
            ? userRole === "ADMIN"
              ? 360
              : 260
            : userRole === "ADMIN"
              ? 420
              : 320;
      const dropdownWidth = 176;
      const spaceBelow = window.innerHeight - rect.bottom;

      let top = rect.bottom + window.scrollY;
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        top = rect.top + window.scrollY - dropdownHeight - 4; // Open upwards
      } else {
        top = top + 4; // Open downwards
      }

      setCoords({
        top,
        left: Math.max(10, rect.right + window.scrollX - dropdownWidth),
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-600 focus:outline-none shadow-sm inline-block"
      >
        <MdMoreVert size={22} />
      </button>
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="absolute w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-y-auto max-h-[400px] text-right"
          >
            <button
              onClick={() => {
                setIsOpen(false);
                openDetail(app);
              }}
              className="w-full px-4 py-2.5 text-sm text-cyan-700 hover:bg-cyan-50 transition flex items-center gap-2.5 font-bold"
            >
              <MdVisibility size={18} />
              تفاصيل
            </button>

            {!isDeletedMode && (
              <button
                onClick={() =>
                  router.push(`/panel/applications/${app.id}/edit`)
                }
                className="w-full px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition flex items-center gap-2.5 font-bold"
              >
                <FaRegEdit size={18} />
                تحرير
              </button>
            )}

            {!isDeletedMode && (isAddedMode || isExpiringMode) && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleOpenWhatsApp(app);
                }}
                className="w-full px-4 py-2.5 text-sm text-[#25D366] hover:bg-[#25D366]/10 transition flex items-center gap-2.5 font-bold border-t border-gray-50"
              >
                <FaWhatsapp size={18} />
                إضافة لواتساب
              </button>
            )}

            {!isDeletedMode && !isAddedMode && !isExpiringMode && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSendReviewLink(app);
                }}
                className={`w-full px-4 py-2.5 text-sm transition flex items-center gap-2.5 font-bold border-t border-gray-50 ${app.Review ? "text-gray-400 bg-gray-50/50 cursor-not-allowed" : "text-[#25D366] hover:bg-[#25D366]/10 cursor-pointer"}`}
              >
                <FaWhatsapp size={18} />
                {app.Review ? "تم طلب التقييم مسبقاً" : "إرسال طلب تقييم"}
              </button>
            )}

            {isDeletedMode && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setConfirm({
                    kind: "restore",
                    appId: app.id,
                    appIndex: app.appIndex,
                  });
                }}
                className="w-full px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition flex items-center gap-2.5 font-bold"
              >
                <MdOutlineRefresh size={18} />
                إستعادة الطلب
              </button>
            )}

            {!isDeletedMode && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openStatusModal(app);
                }}
                className="w-full px-4 py-2.5 text-sm text-violet-600 hover:bg-violet-50 transition flex items-center gap-2.5 font-bold"
              >
                <MdSwapHoriz size={18} />
                تحديث الحالة
              </button>
            )}

            {!isDeletedMode && !isAddedMode && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openCustomerNoteModal(app);
                }}
                className="w-full px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition flex items-center gap-2.5 font-bold"
              >
                <MdOutlineSpeakerNotes size={18} />
                ملاحظة للمشترك
              </button>
            )}

            {!isDeletedMode && (
              <button
                disabled={!canChangeStatus(app.status) || actionId === app.id}
                onClick={() => {
                  setIsOpen(false);
                  setConfirm({
                    kind: "reject",
                    appId: app.id,
                    appIndex: app.appIndex,
                  });
                }}
                className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdClose size={18} />
                إلغاء
              </button>
            )}

            {!isDeletedMode && isAddedMode && (
              <button
                disabled={actionId === app.id}
                onClick={() => {
                  setIsOpen(false);
                  setConfirm({
                    kind: "promote",
                    appId: app.id,
                    appIndex: app.appIndex,
                  });
                }}
                className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition flex items-center gap-2.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdSend size={18} />
                طلب جديد
              </button>
            )}

            {!isDeletedMode && !isAddedMode && !isExpiringMode && (
              <button
                disabled={!canChangeStatus(app.status) || actionId === app.id}
                onClick={() => {
                  setIsOpen(false);
                  setConfirm({
                    kind: "activate",
                    appId: app.id,
                    appIndex: app.appIndex,
                  });
                }}
                className="w-full px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition flex items-center gap-2.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdDone size={18} />
                تفعيل
              </button>
            )}

            <div className="my-1 border-t border-gray-100" />

            {userRole === "ADMIN" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/panel/applications/${app.id}/logs`);
                }}
                className="w-full px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition flex items-center gap-2.5 font-bold border-t border-gray-50"
              >
                <MdHistory size={18} />
                سجل التعديلات
              </button>
            )}

            {userRole === "ADMIN" && (
              <button
                disabled={actionId === app.id}
                onClick={() => {
                  setIsOpen(false);
                  setConfirm({
                    kind: "delete",
                    appId: app.id,
                    appIndex: app.appIndex,
                  });
                }}
                className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdDelete size={18} />
                {isDeletedMode ? "حذف نهائي" : "حذف"}
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

export default function AdminApplicationsClient({
  isDeletedMode = false,
  isAddedMode = false,
  isExpiringMode = false,
  userRole = "ADMIN",
}) {
  const router = useRouter();

  const storageKey = isDeletedMode
    ? "panel_deleted"
    : isAddedMode
      ? "panel_added"
      : isExpiringMode
        ? "panel_expiring"
        : "panel_main";

  const getStoredFilters = () => {
    try {
      return JSON.parse(sessionStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  };

  const [page, setPage] = useState(() => getStoredFilters()?.page || 1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingApp, setCreatingApp] = useState(false);
  const [error, setError] = useState(null);
  const [detailApp, setDetailApp] = useState(null);
  const [notesApp, setNotesApp] = useState(null);
  const [statusApp, setStatusApp] = useState(null);
  const [customerNoteApp, setCustomerNoteApp] = useState(null);
  const [actionId, setActionId] = useState(null);

  const [confirm, setConfirm] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const handleSendReviewLink = (app) => {
    if (app.Review) {
      setAlertMsg("لقد تم تقديم تقييم لهذا الطلب مسبقاً.");
      return;
    }
    const reviewLink = `${window.location.origin}/review?appId=${app.id}`;

    const text = `مرحبا ${app.newName || app.name} 🌹

شكراً لاختيارك إنترنت تيليكوم 🙏

إذا بتعطينا دقيقة من وقتك، ادخل على الرابط وقيم تجربتك معنا بعدد النجوم، واكتب رأيك بكل صراحة 👇

${reviewLink}

رأيك بيهمنا، وبيساعدنا نطوّر خدمتنا ونكسب ثقة ناس أكتر 🤍`;

    let phoneToUse = app.phone || app.phone2 || app.newPhone;
    console.log(phoneToUse);
    // 0 (538) 897 79 39
    if (phoneToUse) {
      const waUrl = `https://wa.me/${phoneToUse.replace(/\D/g, "").replace(/^0/, "90")}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank");
    } else {
      setAlertMsg("لا يوجد رقم هاتف متاح لإرسال رسالة الواتساب.");
    }
  };

  const handleOpenWhatsApp = (app) => {
    const phoneToUse = app.phone || app.phone2 || app.newPhone || "";
    const digits = phoneToUse.replace(/\D/g, "").replace(/^0/, "");
    if (!digits) {
      setAlertMsg("لا يوجد رقم هاتف متاح.");
      return;
    }
    window.open(`https://wa.me/90${digits}`, "_blank");
    fetch(`/api/panel/applications/${app.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsappStatus: "ADDED" }),
    }).then(() => load(page));
  };

  const [searchInput, setSearchInput] = useState(
    () => getStoredFilters()?.searchInput ?? "",
  );
  const [debouncedQ, setDebouncedQ] = useState(
    () => getStoredFilters()?.searchInput?.trim() ?? "",
  );
  const [statusFilter, setStatusFilter] = useState(
    () => getStoredFilters()?.statusFilter ?? "",
  );
  const [dateField, setDateField] = useState(
    () =>
      getStoredFilters()?.dateField ??
      (isDeletedMode ? "updatedAt" : "createdAt"),
  );
  const [dateFrom, setDateFrom] = useState(() => {
    const saved = getStoredFilters()?.dateFrom;
    if (saved !== undefined && saved !== null) return saved;
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().slice(0, 10);
  });
  const [dateTo, setDateTo] = useState(() => getStoredFilters()?.dateTo ?? "");
  const [lastClickedAppId, setLastClickedAppId] = useState(() => {
    try {
      return sessionStorage.getItem(`${storageKey}_last`) || null;
    } catch {
      return null;
    }
  });
  const searchFirstRun = useRef(true);

  // Persist filters to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          searchInput,
          statusFilter,
          dateField,
          dateFrom,
          dateTo,
          page,
        }),
      );
    } catch {}
  }, [
    storageKey,
    searchInput,
    statusFilter,
    dateField,
    dateFrom,
    dateTo,
    page,
  ]);

  const handleAppClick = (appId) => {
    setLastClickedAppId(appId);
    try {
      sessionStorage.setItem(`${storageKey}_last`, appId);
    } catch {}
  };

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
      if (isDeletedMode) params.set("deleted", "true");
      else if (isAddedMode) params.set("view", "added");
      else if (isExpiringMode) params.set("view", "expiring");
      if (debouncedQ) params.set("q", debouncedQ);
      if (!isExpiringMode) {
        if (statusFilter) params.set("status", statusFilter);
        if (!debouncedQ) {
          if (dateField && dateField !== "createdAt")
            params.set("dateField", dateField);
          if (dateFrom) params.set("dateFrom", dateFrom);
          if (dateTo) params.set("dateTo", dateTo);
        }
      }
      return params.toString();
    },
    [
      isDeletedMode,
      isAddedMode,
      isExpiringMode,
      debouncedQ,
      statusFilter,
      dateField,
      dateFrom,
      dateTo,
    ],
  );

  const load = useCallback(
    async (p) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/panel/applications?${buildQuery(p)}`);
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

  const handleCreateBlankApp = () => {
    router.push(`/panel/applications/new/edit`);
  };

  const exportToExcel = useCallback(async () => {
    setExportLoading(true);
    try {
      const allApplications = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const query = buildQuery(currentPage);
        const res = await fetch(`/api/panel/applications?${query}`);
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
          "الإسم واللقب",
          "رقم الموبايل",
          "رقم الوطني",
          "المواليد",
          "كود العنوان",
          "الشركة",
          "رقم الإشتراك",
          "الباقة",
          "تاريخ التسجيل",
          "تاريخ التفعيل",
        ],
        ...allApplications.map((app) => [
          app.appIndex,
          app.name,
          app.phone,
          app.nationalNumber,
          app.birthDate,
          app.addressCode,
          app.internetCompany || "—",
          app.subscriptionNo || "—",
          app.selectedPackage || app.noContractTechType || "—",
          app.createdAt ? formatDate(app.createdAt) : "",
          app.completedAt ? formatDate(app.completedAt) : "",
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
      const res = await fetch(`/api/panel/applications/${id}`);
      const json = await res.json().catch(() => ({}));
      if (res.ok) setDetailApp(json);
    } catch {
      /* ignore */
    }
  };

  const deleteStatus = async (id) => {
    setActionId(id);
    try {
      const res = await fetch(
        `/api/panel/applications/${id}${isDeletedMode ? "?hard=true" : ""}`,
        {
          method: "DELETE",
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAlertMsg(json.error || "فشل الحذف");
        return;
      }
      setConfirm(null);
      await load(page);
    } finally {
      setActionId(null);
    }
  };

  const restoreStatus = async (id) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/panel/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAlertMsg(json.error || "فشل إستعادة الطلب");
        return;
      }
      setConfirm(null);
      await load(page);
    } finally {
      setActionId(null);
    }
  };

  const updateStatus = async (id, status) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/panel/applications/${id}`, {
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

  const handleNoteAdded = (newNote) => {
    setData((prev) => {
      if (!prev) return prev;
      const newApps = prev.applications.map((app) =>
        app.id === notesApp.id
          ? { ...app, notes: [newNote, ...(app.notes || [])] }
          : app,
      );
      return { ...prev, applications: newApps };
    });
    setNotesApp((prev) => ({
      ...prev,
      notes: [newNote, ...(prev.notes || [])],
    }));
  };

  const handleNoteUpdated = (updated) => {
    const patchNotes = (notes) =>
      (notes || []).map((n) => (n.id === updated.id ? updated : n));
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        applications: prev.applications.map((app) =>
          app.id === notesApp?.id
            ? { ...app, notes: patchNotes(app.notes) }
            : app,
        ),
      };
    });
    setNotesApp((prev) =>
      prev ? { ...prev, notes: patchNotes(prev.notes) } : prev,
    );
  };

  const handleNoteDeleted = (noteId) => {
    const filterNotes = (notes) => (notes || []).filter((n) => n.id !== noteId);
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        applications: prev.applications.map((app) =>
          app.id === notesApp?.id
            ? { ...app, notes: filterNotes(app.notes) }
            : app,
        ),
      };
    });
    setNotesApp((prev) =>
      prev ? { ...prev, notes: filterNotes(prev.notes) } : prev,
    );
  };

  const handleStatusUpdate = async (newStatus, delayedUntil) => {
    if (!statusApp) return;
    setActionId(statusApp.id);
    try {
      const body = { status: newStatus };
      if (newStatus === "DELAYED" && delayedUntil) {
        const isoDelayDate = formatIsoDateFromDisplay(delayedUntil);
        if (!isoDelayDate) {
          setAlertMsg("يرجى إدخال تاريخ التأجيل بصيغة DD/MM/YYYY");
          return;
        }
        body.delayedUntil = isoDelayDate;
      }
      const res = await fetch(`/api/panel/applications/${statusApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAlertMsg(json.error || "فشل التحديث");
        return;
      }
      setStatusApp(null);
      await load(page);
    } finally {
      setActionId(null);
    }
  };

  const handleCustomerNoteUpdate = async (newAdminNote) => {
    if (!customerNoteApp) return;
    setActionId(customerNoteApp.id);
    try {
      const res = await fetch(`/api/panel/applications/${customerNoteApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: newAdminNote }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAlertMsg(json.error || "فشل تحديث ملاحظة المشترك");
        return;
      }
      setCustomerNoteApp(null);
      await load(page);
    } finally {
      setActionId(null);
    }
  };

  const applications = data?.applications ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  // Detect duplicates within the current page
  const { dupNames, dupPhones } = useMemo(() => {
    const nameCount = {};
    const phoneCount = {};
    for (const app of applications) {
      const n = (app.name || "").trim().toLowerCase();
      const p = (app.phone || "").replace(/\D/g, "");
      if (n) nameCount[n] = (nameCount[n] || 0) + 1;
      if (p) phoneCount[p] = (phoneCount[p] || 0) + 1;
    }
    return {
      dupNames: new Set(Object.keys(nameCount).filter((k) => nameCount[k] > 1)),
      dupPhones: new Set(
        Object.keys(phoneCount).filter((k) => phoneCount[k] > 1),
      ),
    };
  }, [applications]);

  const isDupName = (name) => dupNames.has((name || "").trim().toLowerCase());
  const isDupPhone = (phone) => dupPhones.has((phone || "").replace(/\D/g, ""));

  const isDueDelayed = (app) => {
    if (app.status !== "DELAYED" || !app.delayedUntil) return false;
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    return new Date(app.delayedUntil) <= todayEnd;
  };

  const canChangeStatus = (status) =>
    isExpiringMode
      ? status !== "REJECTED"
      : status !== "REJECTED" && status !== "ACTIVATED";

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedQ("");
    setStatusFilter("");
    setDateField("createdAt");
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
              {isDeletedMode ? (
                <MdDelete size={26} />
              ) : isExpiringMode ? (
                <MdOutlineTimer size={26} />
              ) : (
                <MdOutlineAssignment size={26} />
              )}
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                {isDeletedMode
                  ? "الطلبات المحذوفة"
                  : isAddedMode
                    ? "الطلبات المضافة"
                    : isExpiringMode
                      ? "طلبات ستنتهي قريباً"
                      : "الطلبات"}
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
          <div className="flex flex-col md:flex-row gap-3">
            {!isDeletedMode && !isAddedMode && !isExpiringMode && (
              <button
                type="button"
                onClick={handleCreateBlankApp}
                disabled={creatingApp || loading}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
                style={{
                  background: `linear-gradient(to left, #ffb245, #f36802)`,
                }}
              >
                {creatingApp ? (
                  <MdOutlineRefresh size={20} className="animate-spin" />
                ) : (
                  <MdAdd size={20} />
                )}
                إنشاء طلب جديد
              </button>
            )}
            <button
              type="button"
              onClick={() => load(page)}
              disabled={loading || creatingApp}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              style={{
                background: `linear-gradient(to left, ${ACCENT}, ${ACCENT_DARK})`,
              }}
            >
              <MdOutlineRefresh
                size={20}
                className={loading && !creatingApp ? "animate-spin" : ""}
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
          <div
            className={`${isDeletedMode ? "lg:col-span-5" : "lg:col-span-3"} relative`}
          >
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
          {!isDeletedMode && !isExpiringMode && (
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                حالة الطلب
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white py-1.5 px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
              >
                <option value="">كل الحالات</option>
                {Object.entries(STATUS_LABELS)
                  .filter(([key]) =>
                    isAddedMode
                      ? key === "NOT_COMPLETED" || key === "COMPLETED"
                      : key !== "NOT_COMPLETED" && key !== "COMPLETED",
                  )
                  .map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {!isExpiringMode && (
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                تصفية حسب
              </label>
              <select
                value={dateField}
                onChange={(e) => {
                  setDateField(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white py-1.5 px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
              >
                <option value="createdAt">تاريخ التسجيل</option>
                {isDeletedMode && (
                  <option value="updatedAt">تاريخ الحذف</option>
                )}
                {!isDeletedMode && !isAddedMode && (
                  <option value="completedAt">تاريخ التفعيل</option>
                )}
                {!isDeletedMode && !isAddedMode && (
                  <option value="delayedUntil">تاريخ التأجيل</option>
                )}
              </select>
            </div>
          )}
          {!isExpiringMode && (
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
          )}
          {!isExpiringMode && (
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
          )}
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
                      الإسم واللقب
                    </span>
                  </th>
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <MdPhone size={18} />
                      رقم الموبايل
                    </span>
                  </th>
                  {!isDeletedMode && (
                    <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <MdOutlineTaskAlt size={18} />
                        الحالة
                      </span>
                    </th>
                  )}
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <MdCalendarMonth size={18} />
                      تاريخ التسجيل
                    </span>
                  </th>
                  {isDeletedMode && (
                    <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <MdCalendarMonth size={18} />
                        تاريخ الحذف
                      </span>
                    </th>
                  )}
                  {!isDeletedMode && !isAddedMode && !isExpiringMode && (
                    <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <MdDoneAll size={18} />
                        تاريخ التفعيل
                      </span>
                    </th>
                  )}
                  {!isDeletedMode && !isAddedMode && !isExpiringMode && (
                    <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <MdOutlineTimer size={18} />
                        تاريخ التأجيل
                      </span>
                    </th>
                  )}
                  {isExpiringMode && (
                    <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <MdDoneAll size={18} />
                        تاريخ التفعيل
                      </span>
                    </th>
                  )}
                  {isExpiringMode && (
                    <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <MdOutlineTimer size={18} />
                        تاريخ الانتهاء
                      </span>
                    </th>
                  )}

                  {isAddedMode && (
                    <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <FaWhatsapp size={16} />
                        واتساب
                      </span>
                    </th>
                  )}
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <MdOutlineSpeakerNotes size={18} />
                      ملاحظات
                    </span>
                  </th>
                  <th className="px-3 py-3.5 font-bold whitespace-nowrap min-w-40 text-center">
                    <span className="inline-flex items-center gap-1.5">
                      <TiEdit size={18} />
                      إجراءات
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center">
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
                  applications.map((app, idx) => {
                    const dueDelayed = isDueDelayed(app);
                    console.log(dueDelayed);
                    const expiringSoon =
                      isExpiringMode && app.expiresAt
                        ? (new Date(app.expiresAt) - new Date()) /
                            (1000 * 60 * 60 * 24) <=
                          60
                        : false;
                    const isLastClicked = app.id === lastClickedAppId;
                    return (
                      <tr
                        key={app.id}
                        onClick={() => handleAppClick(app.id)}
                        className={`border-b transition-colors hover:bg-cyan-50/40 cursor-pointer ${
                          isLastClicked
                            ? "bg-blue-200"
                            : idx % 2 === 0
                              ? "bg-white"
                              : "bg-slate-50/40"
                        } ${dueDelayed ? "outline-2 outline-orange-500 -outline-offset-2 z-10 relative bg-orange-50/30 border-none" : isAddedMode && app.whatsappStatus === "ADDED" ? "outline-2 outline-emerald-400 -outline-offset-2 z-10 relative bg-emerald-50/30 border-none" : expiringSoon ? "outline-2 outline-amber-400 -outline-offset-2 z-10 relative bg-amber-50/30 border-none" : "border-gray-100"}`}
                      >
                        <td
                          className="px-3 py-3.5 text-center font-mono font-bold tabular-nums"
                          dir="ltr"
                          style={{ color: ACCENT }}
                        >
                          {app.appIndex}
                        </td>
                        <td
                          className="px-3 py-3.5 text-gray-800 max-w-40 truncate font-medium"
                          title={app.name}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {app.name}
                            {isDupName(app.name) && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 ring-1 ring-orange-200/60 whitespace-nowrap shrink-0">
                                مكرر
                              </span>
                            )}
                          </span>
                        </td>
                        <td
                          className="px-3 py-3.5 whitespace-nowrap text-blue-700 underline"
                          dir="ltr"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <a
                              href={`whatsapp://send?phone=9${app.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              onClick={() => {
                                fetch(`/api/panel/applications/${app.id}`, {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    whatsappStatus: "ADDED",
                                  }),
                                }).then(() => load(page));
                              }}
                            >
                              {app.phone}
                            </a>
                            {isDupPhone(app.phone) && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 ring-1 ring-orange-200/60 whitespace-nowrap shrink-0 no-underline">
                                مكرر
                              </span>
                            )}
                          </span>
                        </td>
                        {!isDeletedMode && (
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeClass(app.status)}`}
                            >
                              {describeStatus(app.status)}
                            </span>
                          </td>
                        )}
                        <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap text-xs">
                          {app.createdAt ? formatDate(app.createdAt) : "—"}
                        </td>
                        {isDeletedMode && (
                          <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap text-xs">
                            {app.updatedAt ? formatDate(app.updatedAt) : "—"}
                          </td>
                        )}
                        {!isDeletedMode && !isAddedMode && !isExpiringMode && (
                          <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap text-xs">
                            {app.completedAt
                              ? formatDate(app.completedAt)
                              : "—"}
                          </td>
                        )}
                        {!isDeletedMode && !isAddedMode && !isExpiringMode && (
                          <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap text-xs">
                            {app.delayedUntil
                              ? formatDate(app.delayedUntil, "4")
                              : "—"}
                          </td>
                        )}
                        {isExpiringMode && (
                          <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap text-xs">
                            {app.completedAt
                              ? formatDate(app.completedAt)
                              : "—"}
                          </td>
                        )}
                        {isExpiringMode && (
                          <td className="px-3 py-3.5 whitespace-nowrap text-xs font-bold text-amber-700">
                            {app.expiresAt ? formatDate(app.expiresAt) : "—"}
                          </td>
                        )}
                        {isAddedMode && (
                          <td className="px-3 py-3.5 whitespace-nowrap text-center">
                            {app.whatsappStatus === "ADDED" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                <FaWhatsapp size={12} />
                                مضاف
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                                غير مضاف
                              </span>
                            )}
                          </td>
                        )}
                        <td className="px-3 py-3.5 max-w-48">
                          <button
                            onClick={() => setNotesApp(app)}
                            className="text-right w-full text-xs hover:bg-slate-100 p-2 rounded-xl transition group"
                          >
                            {app.notes && app.notes.length > 0 ? (
                              <span className="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis block max-w-36">
                                {app.notes[0].text}
                              </span>
                            ) : (
                              <span className="text-cyan-600 font-bold group-hover:text-cyan-800">
                                + إضافة ملاحظة
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <ActionMenu
                            app={app}
                            openDetail={openDetail}
                            setConfirm={setConfirm}
                            canChangeStatus={canChangeStatus}
                            actionId={actionId}
                            openStatusModal={setStatusApp}
                            openCustomerNoteModal={setCustomerNoteApp}
                            isDeletedMode={isDeletedMode}
                            isAddedMode={isAddedMode}
                            isExpiringMode={isExpiringMode}
                            userRole={userRole}
                            handleSendReviewLink={handleSendReviewLink}
                            handleOpenWhatsApp={handleOpenWhatsApp}
                          />
                        </td>
                      </tr>
                    );
                  })
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
          isDeletedMode={isDeletedMode}
          onClose={() => setDetailApp(null)}
        />
      )}

      {notesApp && (
        <AdminNotesModal
          application={notesApp}
          onClose={() => setNotesApp(null)}
          onNoteAdded={handleNoteAdded}
          onNoteUpdated={handleNoteUpdated}
          onNoteDeleted={handleNoteDeleted}
        />
      )}

      {statusApp && (
        <AdminStatusModal
          application={statusApp}
          onClose={() => setStatusApp(null)}
          onUpdateStatus={handleStatusUpdate}
          loading={!!actionId && actionId === statusApp.id}
          allowedStatuses={
            isExpiringMode
              ? Object.keys(STATUS_LABELS)
              : isAddedMode
                ? ["NOT_COMPLETED", "COMPLETED", "NEW"]
                : Object.keys(STATUS_LABELS).filter(
                    (s) => s !== "NOT_COMPLETED" && s !== "COMPLETED",
                  )
          }
        />
      )}

      {customerNoteApp && (
        <AdminCustomerNoteModal
          application={customerNoteApp}
          onClose={() => setCustomerNoteApp(null)}
          onUpdateAdminNote={handleCustomerNoteUpdate}
          loading={!!actionId && actionId === customerNoteApp.id}
        />
      )}

      <AdminConfirmDialog
        open={!!confirm}
        kind={confirm?.kind}
        title={
          confirm?.kind === "reject"
            ? "إلغاء الطلب؟"
            : confirm?.kind === "delete"
              ? "حذف الطلب نهائياً؟"
              : confirm?.kind === "restore"
                ? "إستعادة الطلب؟"
                : confirm?.kind === "promote"
                  ? "تحويل لطلب جديد؟"
                  : "تفعيل الطلب؟"
        }
        message={
          confirm?.kind === "delete"
            ? `هل أنت متأكد من الحذف النهائي للطلب #${confirm?.appIndex}؟ سيتم فقدان البيانات للأبد.`
            : confirm?.kind === "restore"
              ? `هل تريد إستعادة الطلب #${confirm?.appIndex} ليعود لصفحة الطلبات الأساسية؟`
              : confirm?.kind === "promote"
                ? `سيتم نقل الطلب #${confirm?.appIndex} إلى قائمة الطلبات الرئيسية.`
                : confirm
                  ? `هل أنت متأكد؟ الطلب #${confirm?.appIndex}`
                  : ""
        }
        confirmLabel={
          confirm?.kind === "reject"
            ? "نعم، إلغاء"
            : confirm?.kind === "delete"
              ? "نعم، حذف"
              : confirm?.kind === "restore"
                ? "نعم، إستعادة"
                : confirm?.kind === "promote"
                  ? "نعم، نقل"
                  : "نعم، تفعيل"
        }
        cancelLabel="رجوع"
        loading={!!actionId && confirm && actionId === confirm.appId}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.kind === "delete") {
            deleteStatus(confirm.appId);
          } else if (confirm.kind === "restore") {
            restoreStatus(confirm.appId);
          } else if (confirm.kind === "promote") {
            updateStatus(confirm.appId, "NEW");
          } else if (confirm.kind === "reject") {
            updateStatus(confirm.appId, "REJECTED");
          } else {
            updateStatus(confirm.appId, "ACTIVATED");
          }
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
