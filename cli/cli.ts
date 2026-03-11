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
const affectedPaths: Set<string> = new Set();
const componentTitle: Set<string> = new Set();

export function removeDot(filePath: string) {
  const split = filePath.split('/');
  if(split[0] == '.') {
    let path = '';
    for(let i = 1; i < split.length; i++) {
      path += '/';
      path += split[i];
    }
    return path;
  }
  return filePath;
}
export function affectedComponent(
  filePath: string,
  stats: IStats,
  visited: Set<string> = new Set()
) {
  filePath = removeDot(filePath);

  if (visited.has(filePath)) {
    return;
  }

  visited.add(filePath);

  for (const module of stats.modules) {
    if (module.nameForCondition != null) {
      if (module.nameForCondition.includes("node_modules")) {
        continue;
      }

      if (module.nameForCondition.includes(filePath)) {
        for (const reason of module.reasons) {
          affectedPaths.add(reason.moduleName);
          affectedComponent(reason.moduleName, stats, visited);
        }
      }
    }
  }
}

export async function runner() {
  // temp variable for test only !!
  const changedFiles = ["/src/components/SmartLink/SmartLink.jsx"];
  const filePath = "./storybook-static/preview-stats.json";
  const trimmedName = path.join(".OdinSnap", "trimmed-stats.json")
  const componentStatsPath = "./storybook-static/index.json";
  const dest = path.join(".OdinSnap", "component-stats.json");
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
    const statsPath = trimmedName;

    const stats = await readStatsFile(statsPath);
    const componentStats = await readStatsFile(componentStatsPath);

    for(const filePath of changedFiles) {
      affectedComponent(filePath, stats);
    }

    for(const cmpPath of affectedPaths) {
      for(const [key, value] of Object.entries(componentStats.entries)) {
        const importPath = (value as any).importPath;
        const title = (value as any).title;
        if(importPath.includes(cmpPath)) {
          componentTitle.add(title);
        }
      }
    }
    console.log(componentTitle);

  } else {
    console.warn(
      "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
    );
  }
}
