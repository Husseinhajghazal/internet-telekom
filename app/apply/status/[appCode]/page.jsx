"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ApplicationInfoView from "../../../../components/ApplicationInfoView";

const ApplicationStatusPage = () => {
  const params = useParams();
  const appCode = params?.appCode;
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appCode) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/applications/by-code/${encodeURIComponent(appCode)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "تعذر تحميل الطلب.");
        }
        if (!cancelled) setApplication(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "حدث خطأ.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appCode]);

  return (
    <ApplicationInfoView application={application} loading={loading} error={error} />
  );
};

export default ApplicationStatusPage;
