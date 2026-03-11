#!/usr/bin/env node
import { checkPkgExist } from "@/packages/cliHelpers/checkPkgExist";
import { generateStats } from "@/packages/cliHelpers/generateStats";
import { mkdir } from "@/packages/cliHelpers/mkdir";
import fs from "fs";
import dag from "dag-rs";
import { identifyPackageManager } from "identify-package-manager";
import { execCommand } from "@/packages/utils/execCommand";
import { trimStats } from "@/packages/utils/trimStats";
import path from "path";
import { readStatsFile } from "@/packages/utils/readStats";

interface IReason {
  moduleName: string;
  moduleId: null | string;
}
interface IModule {
  name: string;
  id: null | string;
  nameForCondition: string;
  reasons: IReason[];
}
interface IStats {
  modules: IModule[]
  
}
export function affectedComponent(filePath: string, stats: IStats) {

  for(const module of stats.modules) {
    if(module.nameForCondition != null ){
      if(module.nameForCondition.includes(filePath)) {
        for(const reason of module.reasons) {
          console.log(reason);
        }
      }
    }
  }
}
export async function runner() {
  // temp variable for test only !!
  const changedFiles = ["/src/components/Tooltip/Tooltip.jsx"];
  const filePath = "./storybook-static/preview-stats.json";
  const trimmedName = path.join(".OdinSnap", "trimmed-stats.json")

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
    // temp skipping (not for prod)
    // if (packageManager === "yarn-berry") {
    //   execCommand("yarn storybook build --stats-json");
    // } else if (packageManager === "npm") {
    //   execCommand("npm run storybook build --stats-json");
    // } else if (packageManager === "pnpm") {
    //   execCommand("pnpm run storybook build --stats-json");
    // } else if (packageManager === "bun") {
    //   execCommand("bun run storybook build --stats-json");
    // } 
    // else {
    //   console.log(
    //     "some unknown package manager is being used !! or yarn version 1 or 2 is being used",
    //   );
    // }
    await trimStats(filePath, trimmedName);
    // iterate over changed files

    const statsPath = trimmedName;

    const stats = await readStatsFile(statsPath);
    // for(const filePath of changedFiles) {
    //   console.log(stats);
    // }
    for(const filePath of changedFiles) {
      // recursive
      affectedComponent(filePath, stats);
    }
    
  } else {
    console.warn(
      "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
    );
  }
}
