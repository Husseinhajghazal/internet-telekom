"use client";

import React, { useEffect, useRef } from "react";

/**
 * Lightweight wrapper around `lottie-web` that loads animation JSON from `/public`.
 * `path` should start with `/`, e.g. `/animations/WiFi%20Connecting.json`.
 */
const LottieAnimation = ({ path, width = 60, height = 60, className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let anim = null;
    let cancelled = false;

    const init = async () => {
      if (!containerRef.current) return;

      const lottie = (await import("lottie-web")).default;
      if (cancelled) return;

      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path,
      });
    };

    init();

    return () => {
      cancelled = true;
      if (anim) anim.destroy();
    };
  }, [path]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{ width, height }}
    />
  );
};

export default LottieAnimation;
