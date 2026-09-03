import { invokeSiteCron } from "../lib/invoke-cron.mjs";

/** Backend-only. Frontend reads /api/weather. */
export default async function handler() {
  return invokeSiteCron("/api/cron/weather");
}

export const config = {
  schedule: "*/30 * * * *",
};
