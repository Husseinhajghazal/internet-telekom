import Link from "next/link";
import prisma from "../../lib/prisma";
import { FaStar, FaQuoteRight } from "react-icons/fa";

const PAGE_SIZE = 12;

export const metadata = {
  title: "تقييمات عملاؤنا | إنترنت تيليكوم",
};

export default async function AllReviewsPage({ searchParams }) {
  const page = Math.max(1, parseInt((await searchParams).page || "1"));

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.review.count({ where: { isApproved: true } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main dir="rtl" className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <Link
          href="/#reviews"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition mb-6"
        >
          ← العودة للرئيسية
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          تقييمات{" "}
          <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
            عملاؤنا
          </span>
        </h1>
        <p className="text-gray-500">{total} تقييمات من عملائنا الكرام</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#18a2e3]/20 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500"
          >
            <div className="absolute top-5 left-5 text-[#18a2e3]/10">
              <FaQuoteRight size={28} />
            </div>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <FaStar
                  key={j}
                  size={14}
                  className={
                    j < review.rating ? "text-amber-400" : "text-gray-200"
                  }
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[80px]">
              {review.comment}
            </p>
            <div className="w-full h-px bg-gray-100 mb-4" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-[#f36802] to-[#ffb245] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {review.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {review.name}
                </div>
                <div className="text-xs text-gray-400">{review.service}</div>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-16">
            لا توجد تقييمات بعد
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 flex-wrap">
          {page > 1 && (
            <Link
              href={`/reviews?page=${page - 1}`}
              className="px-5 py-2.5 rounded-2xl border border-gray-200 font-bold text-gray-700 hover:border-cyan-300 hover:bg-cyan-50 transition"
            >
              السابق
            </Link>
          )}
          <span className="px-4 py-2 rounded-2xl font-bold text-[#18a2e3] border border-[#18a2e3]/30 bg-[#18a2e3]/5">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/reviews?page=${page + 1}`}
              className="px-5 py-2.5 rounded-2xl border border-gray-200 font-bold text-gray-700 hover:border-cyan-300 hover:bg-cyan-50 transition"
            >
              التالي
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
