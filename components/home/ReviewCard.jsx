import React from "react";
import { FaStar, FaQuoteRight } from "react-icons/fa";

/* ── single review card ── */
const ReviewCard = ({ review }) => (
  <div style={{ flexShrink: 0, width: 380 }}>
    <div className="relative h-full bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#18a2e3]/15 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500">
      {/* quote icon */}
      <div className="absolute top-5 left-5 text-[#18a2e3]/10">
        <FaQuoteRight size={28} />
      </div>

      {/* stars */}
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

      {/* comment */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[80px]">
        {review.comment}
      </p>

      {/* divider */}
      <div className="w-full h-px bg-gray-100 mb-4" />

      {/* user info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-[#f36802] to-[#ffb245] flex items-center justify-center text-white font-bold text-sm">
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
  </div>
);

export default ReviewCard;