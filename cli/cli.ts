#!/usr/bin/env node
import { checkPkgExist } from "@/packages/cliHelpers/checkPkgExist";
import { generateStats } from "@/packages/cliHelpers/generateStats";
import { mkdir } from "@/packages/cliHelpers/mkdir";

const res = checkPkgExist("./package.json", "loki");
if (res) {
  mkdir(".OdinSnap");
  await generateStats();
} else {
  console.warn(
    "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
  );
}
