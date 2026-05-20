"use client";

import React, { useState, useEffect } from "react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdPersonOutline,
  MdOutlineRefresh,
  MdOutlineTag,
  MdHistory,
  MdChevronRight,
  MdChevronLeft,
  MdClose,
} from "react-icons/md";
import Button from "../../components/Button";
import { formatDate } from "@/utils/general";

export default function AdminEmployeesClient() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUsr, setEditingUsr] = useState(null);

  const [sessionsUser, setSessionsUser] = useState(null);
  const [sessionsData, setSessionsData] = useState([]);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsPage, setSessionsPage] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/panel/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchSessions = (user, page) => {
    setSessionsLoading(true);
    fetch(`/api/panel/users/${user.id}/sessions?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setSessionsData(d.sessions ?? []);
        setSessionsTotal(d.total ?? 0);
      })
      .finally(() => setSessionsLoading(false));
  };

  const openSessions = (user) => {
    setSessionsUser(user);
    setSessionsPage(1);
    fetchSessions(user, 1);
  };

  const closeSessions = () => setSessionsUser(null);

  const changeSessionsPage = (page) => {
    setSessionsPage(page);
    fetchSessions(sessionsUser, page);
  };

  const formatDuration = (minutes) => {
    if (minutes === null) return "—";
    if (minutes < 60) return `${minutes} دقيقة`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} ساعة ${m} دقيقة` : `${h} ساعة`;
  };

  const openAdd = () => {
    setFormData({ fullName: "", email: "", password: "", role: "EMPLOYEE" });
    setEditingUsr(null);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setFormData({
      fullName: u.fullName,
      email: u.email,
      password: "",
      role: u.role,
    });
    setEditingUsr(u);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("متأكد من حذف هذا المستخدم نهائياً؟")) return;
    try {
      const res = await fetch(`/api/panel/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
      else {
        const d = await res.json();
        alert(d.error || "خطأ بالحذف");
      }
    } catch (e) {
      alert("خطأ اتصال");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingUsr
        ? `/api/panel/users/${editingUsr.id}`
        : `/api/panel/users`;
      const method = editingUsr ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email: formData.email.trim().toLowerCase(),
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchUsers();
      } else {
        const d = await res.json();
        alert(d.error || "حدث خطأ");
      }
    } catch (e) {
      alert("تعذر الحفظ");
    }
  };

  return (
    <div className="space-y-6 text-right relative">
      {/* Section header */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-3">
          <div className="flex items-start gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md relative"
              style={{
                background: `linear-gradient(135deg, #18a2e3, #0d8bc9)`,
              }}
            >
              <MdPersonOutline size={26} />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                إدارة الموظفين والمسؤولين
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <MdOutlineTag
                    className="opacity-70 text-[#18a2e3]"
                    size={16}
                  />
                  إجمالي:{" "}
                  <strong className="text-gray-800">{users.length}</strong>
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="button"
              onClick={openAdd}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95"
              style={{
                background: `linear-gradient(to left, #ffb245, #f36802)`,
              }}
            >
              <MdAdd size={20} />
              إضافة مستخدم
            </button>
            <button
              type="button"
              onClick={fetchUsers}
              disabled={loading}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              style={{
                background: `linear-gradient(to left, #18a2e3, #0d8bc9)`,
              }}
            >
              <MdOutlineRefresh
                size={20}
                className={loading ? "animate-spin" : ""}
              />
              تحديث القائمة
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-bold">
          جاري تحميل البيانات...
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead
                className="text-white"
                style={{
                  background: `linear-gradient(to left, #0d8bc9, #18a2e3)`,
                }}
              >
                <tr>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap">
                    الإسم
                  </th>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap">
                    الإيميل
                  </th>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap">
                    الصلاحية
                  </th>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap">
                    الجلسات
                  </th>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap text-center">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-cyan-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                  >
                    <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                      {u.fullName}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-1.5 rounded-full text-[11px] font-bold ${u.role === "ADMIN" ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-cyan-50 text-cyan-700 border border-cyan-100"}`}
                      >
                        {u.role === "ADMIN" ? "مدير" : "موظف"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => openSessions(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-all"
                      >
                        <MdHistory size={16} />
                        الجلسات
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 bg-white text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all shadow-sm"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 bg-white text-red-600 border border-red-100 rounded-xl hover:bg-red-50 transition-all shadow-sm"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sessionsUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 relative flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <MdHistory size={22} className="text-indigo-500" />
                جلسات {sessionsUser.fullName}
              </h3>
              <button
                onClick={closeSessions}
                className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {sessionsLoading ? (
                <div className="py-16 text-center text-gray-500 font-bold">
                  جاري التحميل...
                </div>
              ) : sessionsData.length === 0 ? (
                <div className="py-16 text-center text-gray-400 font-bold">
                  لا توجد جلسات مسجلة
                </div>
              ) : (
                <table className="min-w-full text-right text-sm">
                  <thead
                    className="text-white"
                    style={{
                      background: "linear-gradient(to left, #4f46e5, #6366f1)",
                    }}
                  >
                    <tr>
                      <th className="px-4 py-3 font-bold whitespace-nowrap">
                        #
                      </th>
                      <th className="px-4 py-3 font-bold whitespace-nowrap">
                        تاريخ الدخول
                      </th>
                      <th className="px-4 py-3 font-bold whitespace-nowrap">
                        تاريخ الخروج
                      </th>
                      <th className="px-4 py-3 font-bold whitespace-nowrap">
                        المدة
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sessionsData.map((s, i) => {
                      const isActive = !s.logoutAt && !s.lastSeenAt;
                      const isInferred = !s.logoutAt && s.lastSeenAt;
                      return (
                        <tr
                          key={s.id}
                          className={`hover:bg-indigo-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                        >
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {(sessionsPage - 1) * 20 + i + 1}
                          </td>
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                            {formatDate(s.loginAt, "2")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {s.logoutAt ? (
                              <span className="text-gray-700">
                                {formatDate(s.logoutAt, "2")}
                              </span>
                            ) : isInferred ? (
                              <span className="text-amber-600 text-xs font-bold">
                                آخر نشاط: {formatDate(s.lastSeenAt, "2")}
                              </span>
                            ) : (
                              <span className="text-green-600 text-xs font-bold">
                                نشط الآن
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                            {isActive ? "—" : formatDuration(s.durationMinutes)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {sessionsTotal > 20 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-bold">
                  الصفحة {sessionsPage} من {Math.ceil(sessionsTotal / 20)} —
                  إجمالي: {sessionsTotal}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={sessionsPage <= 1}
                    onClick={() => changeSessionsPage(sessionsPage - 1)}
                    className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <MdChevronRight size={20} />
                  </button>
                  <button
                    disabled={sessionsPage >= Math.ceil(sessionsTotal / 20)}
                    onClick={() => changeSessionsPage(sessionsPage + 1)}
                    className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <MdChevronLeft size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 relative">
            <div className="p-6 border-b border-gray-50 bg-slate-50">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingUsr ? "تعديل حساب موظف/مدير" : "إضافة مستخدم جديد"}
              </h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full border border-gray-200 bg-slate-50/50 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  placeholder="مثال: أحمد محمد"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  الإيميل
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-200 bg-slate-50/50 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  dir="ltr"
                  placeholder="example@domain.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  كلمة السر {editingUsr && "(اتركها فارغة لعدم التغيير)"}
                </label>
                <input
                  required={!editingUsr}
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border border-gray-200 bg-slate-50/50 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  الصلاحية
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full border border-gray-200 bg-slate-50/50 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="EMPLOYEE">موظف (EMPLOYEE)</option>
                  <option value="ADMIN">مدير (ADMIN)</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-4" dir="ltr">
                <Button
                  type="submit"
                  variant="primary"
                  className="px-8 py-2.5 rounded-xl font-bold"
                >
                  حفظ
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="px-6 py-2.5 rounded-xl font-bold"
                  onClick={() => setModalOpen(false)}
                >
                  إلغاء و رجوع
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
