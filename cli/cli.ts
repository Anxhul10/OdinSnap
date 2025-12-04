#!/usr/bin/env node
import { checkPkgExist } from "../packages/cliHelpers/checkPkgExist.js";
import { generateStats } from "../packages/cliHelpers/generateStats.js";
import { mkdir } from "../packages/cliHelpers/mkdir.js";
import { trimStats } from "../packages/utils/trimStats.js";

const res = checkPkgExist("./package.json", "loki");
await trimStats(
  "./.OdinSnap/preview-stats.json",
  "./.OdinSnap/trimmed-stats.json",
);
// if (res) {
//   mkdir(".OdinSnap");
//   await generateStats();
// } else {
//   console.warn(
//     "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
//   );
// }
