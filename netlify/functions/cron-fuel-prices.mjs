/**
 * Replaces vercel.json cron for fuel prices.
 * Netlify Scheduled Function: Saturday 01:00 UTC (Friday 21:00 AST).
 */
export default async function handler() {
  const base = process.env.URL || process.env.DEPLOY_PRIME_URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) {
    return new Response("Missing URL or CRON_SECRET", { status: 500 });
  }

  const response = await fetch(`${base}/api/cron/fuel-prices`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  schedule: "0 1 * * 6",
};
