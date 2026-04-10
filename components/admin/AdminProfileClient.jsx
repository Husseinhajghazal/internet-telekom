"use client";

import React, { useState, useEffect } from "react";
import { MdPerson } from "react-icons/md";
import Button from "../../components/Button";

export default function AdminProfileClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetch("/api/panel/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          password: "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { password, ...rest } = formData;
      const body = { ...rest };
      if (password) body.password = password;

      const res = await fetch("/api/panel/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "خطأ أثناء الحفظ");
      }

      setSuccess(true);
      setFormData(prev => ({...prev, password: ""})); // clear password field
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return <div className="p-10 text-center font-bold text-gray-400">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-right mt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full blur-3xl -z-10 -m-10"></div>
        <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <MdPerson size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900">إعدادات الحساب</h1>
                <p className="text-gray-500 text-sm mt-1">يمكنك تعديل بيانات حسابك الشخصي من هنا</p>
            </div>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6 font-bold">
            {error}
            </div>
        )}

        {success && (
            <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl mb-6 font-bold">
            تم حفظ التعديلات بنجاح!
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block font-bold text-gray-700 mb-2">الاسم الكامل</label>
                <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full border border-gray-300 bg-slate-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    placeholder="ادخل إسمك الكامل"
                />
            </div>
            <div>
                <label className="block font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 bg-slate-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    placeholder="example@domain.com"
                    dir="ltr"
                />
            </div>
            <div>
                <label className="block font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full border border-gray-300 bg-slate-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    placeholder="اترك الحقل فارغاً إذا لم تكن ترغب بتغييرها"
                    dir="ltr"
                />
            </div>
            <div className="pt-4">
               <Button type="submit" variant="primary" disabled={saving} className="w-full md:w-auto px-10 rounded-xl font-bold py-3">
                  {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
               </Button>
            </div>
        </form>
    </div>
  );
}
