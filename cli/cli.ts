#!/usr/bin/env node
import { checkPkgExist } from "@/packages/cliHelpers/checkPkgExist";
import { generateStats } from "@/packages/cliHelpers/generateStats";
import { mkdir } from "@/packages/cliHelpers/mkdir";
import fs from "fs";
import dag from "dag-rs";
import { identifyPackageManager } from "identify-package-manager";
import { execCommand } from "@/packages/utils/execCommand";

export async function runner() {
  // temp variable for test only !!
  const changedFiles = [];

  const res = checkPkgExist("./package.json", "loki");
  fs.stat("./OdinSnap", function (err, _stat) {
    if (err !== null && err.code === "ENOENT") {
      mkdir(".OdinSnap");
    } else {
      console.log(".OdinSnap exists");
    }
  });
  if (res) {
    // standlone
    const packageManager = identifyPackageManager(true);

    if (packageManager === "yarn-berry") {
      execCommand("yarn build-storybook --stats-json");
    } else if (packageManager === "npm") {
      execCommand("npm run build-storybook --stats-json");
    } else if (packageManager === "pnpm") {
      execCommand("pnpm run build-storybook --stats-json");
    } else if (packageManager === "bun") {
      execCommand("bun run build-storybook --stats-json");
    } else {
      console.log(
        "some unknown package manager is being used !! or yarn version 1 or 2 is being used",
      );
    }
    // iterate over changed files
  } else {
    console.warn(
      "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
    );
  }
}
