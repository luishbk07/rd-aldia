import { invokeSiteCron } from "../lib/invoke-cron.mjs";

export default async function handler() {
  return invokeSiteCron("/api/cron/fuel-prices");
}

export const config = {
  schedule: "0 1 * * 6",
};
