"use client";

import { useEffect } from "react";

export default function ConversionTracker({ event = "advertise_view" }) {
  useEffect(() => {
    const conversionId = process.env.NEXT_PUBLIC_ADS_CONVERSION_ID;
    if (typeof window === "undefined") return;

    if (typeof window.plausible === "function") {
      window.plausible("Conversion", { props: { event } });
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        event_category: "ads",
        event_label: event,
      });
      if (conversionId) {
        window.gtag("event", "conversion", { send_to: conversionId });
      }
    }
  }, [event]);

  return null;
}
