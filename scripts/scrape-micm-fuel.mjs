import { scrapeMicmFuelNotice } from "../lib/fuel/scrape-micm.js";

const result = await scrapeMicmFuelNotice();
console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exitCode = 2;
}
