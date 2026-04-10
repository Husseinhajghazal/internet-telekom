"use client";

import React, { useState } from "react";
import { MdStar, MdCheckCircle } from "react-icons/md";
import StepHeader from "../StepHeader";
import Button from "../Button";

export default function ReviewFormClient({ appId, service, name }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setError("يرجى كتابة نص التقييم وتحديد عدد النجوم.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/review-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, rating, comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="overflow-hidden flex flex-row min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50">
        <div className="flex-1 lg:w-[70%] flex flex-col items-center justify-center min-h-svh p-6 relative shrink-0">
          <div className="max-w-2xl mx-auto w-full text-center space-y-8 relative z-10">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-linear-to-br from-green-400 to-green-600 rounded-full shadow-2xl">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-linear-to-br from-green-300/30 to-green-500/30 rounded-full animate-ping"></div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">تم استلام تقييمك بنجاح!</h1>
              <p className="text-xl text-gray-600">شكراً لك، رأيك يساعدنا على تحسين وتطوير خدماتنا باستمرار.</p>
            </div>

            <div className="flex gap-4 justify-center mt-10">
              <Button variant="secondary" size="large" onClick={() => window.location.href = '/'}>
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block lg:w-[30%] shrink-0">
          <div className="fixed top-0 left-0 lg:w-[30%] h-svh bg-blue-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-black/20 z-10 pointer-events-none"></div>
            <div className="absolute bottom-16 left-10 right-10 z-20 text-white flex flex-col gap-5 drop-shadow-xl animate-fade-in-up">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <MdCheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-3 tracking-wide">الشفافية والتطوير</h3>
                <p className="text-white/80 text-sm leading-relaxed opacity-95">رأيك يهمنا جداً في تطوير خدماتنا لضمان الجودة دائماً.</p>
              </div>
            </div>
            <img src="/approve.jpg" alt="Success visual" className="w-full h-full object-cover animate-step-in-right relative z-0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50">
      <div className="flex-1 lg:w-[70%] flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden shrink-0">

        <div className="w-full max-w-2xl relative z-10">
          <div className="flex flex-col items-center justify-center mb-6">
             <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shadow-inner mb-2 ring-4 ring-amber-50/50">
                <MdStar size={44} />
             </div>
          </div>
          
          <div className="max-w-2xl mx-auto pb-4 pt-0">
            <StepHeader
              title="تقييم الخدمة"
              subTitle={`مرحباً بك ${name || ""}، يسعدنا أن تشاركنا رأيك حول خدمة "${service || "الإنترنت"}".`}
            />
          </div>

          {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6 text-right font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 md:px-6">
          <div className="">
            <label className="block text-right text-gray-700 font-medium mb-2">ما هو تقييمك لمستوى الخدمة؟</label>
             <div className="flex justify-center items-center gap-2 mt-4" dir="ltr">
               {[1,2,3,4,5].map((star) => (
                 <button 
                  type="button" 
                  key={star} 
                  onClick={() => setRating(star)} 
                  className={`p-1 sm:p-2 transition-all hover:scale-110 ${star <= rating ? "text-amber-400 drop-shadow-md" : "text-gray-200"}`}
                 >
                   <MdStar size={56} />
                 </button>
               ))}
             </div>
             <p className="text-sm font-bold text-gray-500 mt-3 text-center">{rating} نجوم من أصل 5</p>
          </div>

          <div className="">
            <label htmlFor="comment" className="block text-right text-gray-700 font-medium mb-2">اكتب تعليقك بصراحة</label>
            <textarea
              name="comment"
              id="comment"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full outline-0 px-4 py-3 border border-gray-200 bg-slate-50 rounded-2xl focus:ring-2 focus:bg-white focus:ring-[#18a2e3] focus:border-transparent text-right resize-none transition-all"
              placeholder="اكتب كيف كانت تجربتك معنا..."
            />
          </div>

          <div className="pt-4 flex justify-center">
            <Button variant="primary" type="submit" size="large" className="w-full md:w-auto px-10 text-lg font-bold" disabled={loading}>
              {loading ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
          </div>
        </form>
      </div>
      </div>

      {/* Sidebar Image */}
      <div className="hidden lg:block lg:w-[30%] shrink-0">
        <div className="fixed top-0 left-0 lg:w-[30%] h-svh bg-blue-50 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-black/20 z-10 pointer-events-none"></div>
          
          {/* Decorative touches */}
          <div className="absolute bottom-16 left-10 right-10 z-20 text-white flex flex-col gap-5 drop-shadow-xl animate-fade-in-up">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <MdStar className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-3 tracking-wide">رأيك يهمنا</h3>
              <p className="text-white/80 text-sm leading-relaxed opacity-95">
                نسعى دائماً لتقديم أفضل الخدمات بكل شفافية. شاركنا تجربتك لنرتقي معاً.
              </p>
            </div>
          </div>

          <img
            src="/call_center.jpg"
            alt="Review visual"
            className="w-full h-full object-cover animate-step-in-right relative z-0"
          />
        </div>
      </div>

    </div>
  );
}
