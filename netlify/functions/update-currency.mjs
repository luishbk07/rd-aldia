import { invokeSiteCron } from "../lib/invoke-cron.mjs";

export default async function handler() {
  return invokeSiteCron("/api/cron/currency");
}

export const config = {
  schedule: "*/15 * * * *",
};
