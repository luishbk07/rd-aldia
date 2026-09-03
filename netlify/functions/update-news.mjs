import { invokeSiteCron } from "../lib/invoke-cron.mjs";

export default async function handler() {
  return invokeSiteCron("/api/cron/news");
}

export const config = {
  schedule: "*/15 * * * *",
};
