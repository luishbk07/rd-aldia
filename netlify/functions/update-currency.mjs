import { invokeSiteCron } from "../lib/invoke-cron.mjs";

/** Backend-only. Frontend reads /api/currency/*. */
export default async function handler() {
  return invokeSiteCron("/api/cron/currency");
}

export const config = {
  schedule: "0 * * * *",
};
