"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MdAdd, MdDelete, MdEdit, MdStar, MdOutlineRefresh, MdSearch, MdFilterList, MdOutlineTag, MdStarBorder, MdCheckCircle, MdCancel } from "react-icons/md";
import AdminConfirmDialog from "./AdminConfirmDialog";
import Button from "../Button";
import { REVIEW_SERVICE_OPTIONS } from "@/utils/general";

export default function AdminReviewsClient() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  
  const [formData, setFormData] = useState({ name: "", rating: 5, comment: "", service: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [starFilter, setStarFilter] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/panel/reviews");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "خطأ في التحميل");
      setReviews(json.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const uniqueServices = useMemo(() => {
    return Array.from(new Set(reviews.map((r) => r.service).filter(Boolean)));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchName = r.name.toLowerCase().includes(searchInput.toLowerCase()) || r.comment.toLowerCase().includes(searchInput.toLowerCase());
      const matchService = serviceFilter ? r.service === serviceFilter : true;
      const matchStar = starFilter ? r.rating === parseInt(starFilter) : true;
      return matchName && matchService && matchStar;
    });
  }, [reviews, searchInput, serviceFilter, starFilter]);

  const handleOpenModal = (review = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        service: review.service || "",
      });
    } else {
      setEditingReview(null);
      setFormData({ name: "", rating: 5, comment: "", service: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editingReview ? `/api/panel/reviews/${editingReview.id}` : "/api/panel/reviews";
    const method = editingReview ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("فشل الحفظ");
      setIsModalOpen(false);
      loadReviews();
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/panel/reviews/${confirmDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      setConfirmDelete(null);
      loadReviews();
    } catch (err) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const toggleApproval = async (review) => {
    try {
      const res = await fetch(`/api/panel/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !review.isApproved }),
      });
      if (!res.ok) throw new Error("فشل تغيير الحالة");
      loadReviews();
    } catch (err) {
      alert("حدث خطأ أثناء تغيير الحالة");
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s}>
            {s <= rating ? (
              <MdStar size={18} className="text-amber-400" />
            ) : (
              <MdStarBorder size={18} className="text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
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
              <MdStar size={26} />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                إدارة التقييمات
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <MdOutlineTag className="opacity-70 text-[#18a2e3]" size={16} />
                  إجمالي: <strong className="text-gray-800">{filteredReviews.length}</strong>
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              style={{ background: `linear-gradient(to left, #ffb245, #f36802)` }}
            >
              <MdAdd size={20} />
              إضافة تقييم جديد
            </button>
            <button
              type="button"
              onClick={loadReviews}
              disabled={loading}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              style={{ background: `linear-gradient(to left, #18a2e3, #0d8bc9)` }}
            >
              <MdOutlineRefresh size={20} className={loading ? "animate-spin" : ""} />
              تحديث القائمة
            </button>
          </div>
        </div>
      </div>

      {/* Search & filters */}
      <div className="rounded-3xl border border-cyan-100/80 bg-white/95 p-4 md:p-6 shadow-md shadow-cyan-500/5 text-right space-y-4">
        <div className="flex items-center gap-2 text-gray-800 font-bold">
          <MdFilterList className="text-[#18a2e3]" size={22} />
          <span>بحث وتصفية</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-3 md:gap-4">
          <div className="lg:col-span-4 relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              بحث (اسم العميل أو التعليق)
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
              تصفية حسب الخدمة
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
            >
              <option value="">كل الخدمات</option>
              {uniqueServices.map((srv) => (
                <option key={srv} value={srv}>{srv}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              تصفية حسب التقييم
            </label>
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
            >
              <option value="">كل التقييمات</option>
              <option value="5">5 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="3">3 نجوم</option>
              <option value="2">نجمتان (2)</option>
              <option value="1">نجمة واحدة (1)</option>
            </select>
          </div>
          <div className="lg:col-span-2 flex items-end">
            <button
              type="button"
              onClick={() => { setSearchInput(""); setServiceFilter(""); setStarFilter(""); }}
              disabled={!searchInput && !serviceFilter && !starFilter}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 px-2 text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              مسح
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">{error}</div>
      ) : loading ? (
        <div className="flex flex-col gap-3 justify-center items-center py-20 text-gray-500">
          <MdOutlineRefresh className="animate-spin text-4xl text-[#18a2e3]"/>
          <p>جاري تحميل التقييمات…</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="text-white" style={{ background: `linear-gradient(to left, #0d8bc9, #18a2e3)` }}>
                <tr>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap">الاسم</th>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap">الخدمة</th>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap">التقييم</th>
                  <th className="px-4 py-3.5 font-bold w-1/3">التعليق</th>
                  <th className="px-4 py-3.5 font-bold whitespace-nowrap text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReviews.map((r, idx) => (
                  <tr key={r.id} className={`hover:bg-cyan-50/40 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                      {r.name}
                      {!r.isApproved && <span className="mr-2 inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold"><MdCancel size={12}/> قيد المراجعة</span>}
                      {r.isApproved && <span className="mr-2 inline-flex items-center gap-1 bg-green-50 text-green-600 text-[10px] px-2 py-0.5 rounded-full font-bold"><MdCheckCircle size={12}/> معتمد</span>}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{r.service || "-"}</td>
                    <td className="px-4 py-3.5">
                      <div className="inline-flex bg-amber-50/50 border border-amber-100 px-3 py-1.5 rounded-full">
                        {renderStars(r.rating)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 leading-relaxed min-w-[300px]">{r.comment}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => toggleApproval(r)} title={r.isApproved ? "إلغاء الإعتماد" : "إعتماد التقييم"} className={`p-2 border rounded-xl transition-all shadow-sm ${r.isApproved ? "bg-white text-orange-500 border-orange-100 hover:bg-orange-50" : "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"}`}>{r.isApproved ? <MdCancel size={18}/> : <MdCheckCircle size={18}/>}</button>
                        <button onClick={() => handleOpenModal(r)} className="p-2 bg-white text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all shadow-sm"><MdEdit size={18}/></button>
                        <button onClick={() => setConfirmDelete(r.id)} className="p-2 bg-white text-red-600 border border-red-100 rounded-xl hover:bg-red-50 transition-all shadow-sm"><MdDelete size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredReviews.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="inline-flex flex-col items-center gap-2 text-gray-500">
                        <MdStar size={48} className="opacity-30" />
                        <span>لا توجد نتائج مطابقة للبحث أو التصفية</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-50 bg-slate-50">
               <h3 className="text-xl font-extrabold text-gray-900">{editingReview ? "تعديل التقييم" : "إضافة تقييم جديد"}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5 flex flex-col items-stretch text-right">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">اسم العميل</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 bg-slate-50/50 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition" placeholder="مثال: أحمد المحمد" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">الخدمة المُقيّمة (اختياري)</label>
                <select
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full border border-gray-200 bg-slate-50/50 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="">— بدون تحديد —</option>
                  {REVIEW_SERVICE_OPTIONS.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.items.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">عدد النجوم (1-5)</label>
                <input required type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full border border-gray-200 bg-slate-50/50 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition text-right" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">رأي العميل (الرسالة)</label>
                <textarea required rows={4} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="w-full border border-gray-200 bg-slate-50/50 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition" placeholder="اكتب شهادة وتقييم العميل هنا..."></textarea>
              </div>
              <div className="flex gap-3 justify-end pt-4" dir="ltr">
                <Button variant="primary" className="px-8 py-2.5 rounded-xl font-bold" type="submit">حفظ التقييم</Button>
                <Button variant="secondary" className="px-6 py-2.5 rounded-xl font-bold" onClick={() => setIsModalOpen(false)} type="button">رجوع</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        open={!!confirmDelete}
        kind="delete"
        title="حذف التقييم نهائياً؟"
        message="هل أنت متأكد من مسح هذا التقييم؟ سيختفي من الموقع بشكل دائم ولن يمكن استرداده."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
