import { invokeSiteCron } from "../lib/invoke-cron.mjs";

/** Backend-only. Frontend reads /api/sports and /api/sports/mlb/*. */
export default async function handler() {
  return invokeSiteCron("/api/cron/mlb");
}

export const config = {
  schedule: "*/15 * * * *",
};
