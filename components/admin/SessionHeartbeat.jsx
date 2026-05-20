"use client";

import { useEffect } from "react";

const INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

export default function SessionHeartbeat() {
  useEffect(() => {
    const beat = () => fetch("/api/panel/heartbeat", { method: "POST" }).catch(() => {});
    beat();
    const id = setInterval(beat, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return null;
}
