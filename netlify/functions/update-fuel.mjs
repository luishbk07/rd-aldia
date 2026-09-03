import { invokeSiteCron } from "../lib/invoke-cron.mjs";

/** Backend-only. Frontend reads /api/fuel-prices. Friday 18:00 UTC. */
export default async function handler() {
  return invokeSiteCron("/api/cron/fuel-prices");
}

export const config = {
  schedule: "0 18 * * 5",
};
