import React, { useRef, useEffect } from "react";
import ReviewCard from "./ReviewCard";

/* ── Scrolling row component ── */
const ScrollRow = ({ items, direction = "right", speed = 40 }) => {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Calculate the width of one set of items
    const totalChildren = el.children.length;
    const halfCount = totalChildren / 2;
    let singleSetWidth = 0;
    for (let i = 0; i < halfCount; i++) {
      singleSetWidth += el.children[i].offsetWidth + 24; // 24px = gap
    }

    // Create the keyframes dynamically (reversed for RTL)
    const name = `scroll-${direction}-${Date.now()}`;
    const fromX = direction === "right" ? singleSetWidth : 0;
    const toX = direction === "right" ? 0 : singleSetWidth;

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes ${name} {
        from { transform: translateX(${fromX}px); }
        to { transform: translateX(${toX}px); }
      }
    `;
    document.head.appendChild(styleEl);

    el.style.animation = `${name} ${speed}s linear infinite`;

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [direction, speed]);

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      {/* fade edges */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 100,
          background: "linear-gradient(to left, white, transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 100,
          background: "linear-gradient(to right, white, transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 24,
          width: "max-content",
          willChange: "transform",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {items.map((review, i) => (
          <ReviewCard key={`set1-${i}`} review={review} />
        ))}
        {items.map((review, i) => (
          <ReviewCard key={`set2-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ScrollRow;