import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

function getGaMeasurementId() {
  return (
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.GA_MEASUREMENT_ID ||
    ""
  );
}

export default function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const gaId = getGaMeasurementId();

  return (
    <>
      {plausible ? (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={plausible}
          strategy="afterInteractive"
          defer
        />
      ) : null}
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
