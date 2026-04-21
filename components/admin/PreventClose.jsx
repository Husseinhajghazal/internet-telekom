"use client";

import { useEffect } from "react";

export default function PreventClose() {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Prompt a confirmation dialog before leaving the page
      e.preventDefault();
      const message = "هل أنت متأكد أنك تريد مغادرة الصفحة؟ قد لا يتم حفظ التغييرات التي قمت بها.";
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}
