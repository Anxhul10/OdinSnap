#!/usr/bin/env node
import { checkPkgExist } from "@/packages/cliHelpers/checkPkgExist";
import { mkdir } from "@/packages/cliHelpers/mkdir";
import fs from "fs";
import { identifyPackageManager } from "identify-package-manager";
import { execCommand } from "@/packages/utils/execCommand";
import { trimStats } from "@/packages/utils/trimStats";
import path from "path";
import { readStatsFile } from "@/packages/utils/readStats";
import { generateRegex } from "@/packages/cliHelpers/generateRegex";
import { getChangedFile } from "@/packages/git/git";
import * as github from "@actions/github";

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
  modules: IModule[];
}
const affectedPaths: Set<string> = new Set();
const componentTitle: Set<string> = new Set();

export function removeDot(filePath: string) {
  const split = filePath.split("/");
  if (split[0] == ".") {
    let path = "";
    for (let i = 1; i < split.length; i++) {
      path += "/";
      path += split[i];
    }
    return path;
  }
  return filePath;
}
export function affectedComponent(
  filePath: string,
  stats: IStats,
  visited: Set<string> = new Set(),
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
  const context = github.context;
  // temp variable for test only !!
  const changedFiles = await getChangedFile(context);
  const filePath = "./storybook-static/preview-stats.json";
  const trimmedName = path.join(".OdinSnap", "trimmed-stats.json");
  const componentStatsPath = "./storybook-static/index.json";
  const res = checkPkgExist("./package.json", "loki");
  fs.stat("./OdinSnap", function (err) {
    if (err !== null && err.code === "ENOENT") {
      mkdir(".OdinSnap");
    } else {
      console.log(".OdinSnap exists");
    };
  });
  if (res) {
    // non-monorepo project
    const packageManager = identifyPackageManager(true);
    if (packageManager === "yarn-berry") {
      execCommand("yarn storybook build --stats-json");
    } else if (packageManager === "npm") {
      execCommand("npm run storybook build --stats-json");
    } else if (packageManager === "pnpm") {
      execCommand("pnpm run storybook build --stats-json");
    } else if (packageManager === "bun") {
      execCommand("bun run storybook build --stats-json");
    } else {
      console.log(
        "some unknown package manager is being used !! or yarn version 1 or 2 is being used",
      );
    }
    await trimStats(filePath, trimmedName);
    const statsPath = trimmedName;

    const stats = await readStatsFile(statsPath);
    const componentStats = await readStatsFile(componentStatsPath);

    for (const filePath of changedFiles) {
      affectedComponent(filePath, stats);
    }

    for (const cmpPath of affectedPaths) {
      for (const [, value] of Object.entries(componentStats.entries)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const importPath = (value as any).importPath;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const title = (value as any).title;
        if (importPath.includes(cmpPath)) {
          componentTitle.add(title);
        }
      }
    }
    const regex = generateRegex(componentTitle);

    console.log("Ensure you are running storyook at http://localhost:6006/!!");
    if (packageManager === "yarn-berry") {
      execCommand(`yarn loki test --storiesFilter="${regex}"`);
    } else if (packageManager === "npm") {
      execCommand(`npm run loki test --storiesFilter="${regex}"`);
    } else if (packageManager === "pnpm") {
      execCommand(`pnpm run loki test --storiesFilter="${regex}"`);
    } else if (packageManager === "bun") {
      execCommand(`bun run loki test --storiesFilter="${regex}"`);
    } else {
      console.log(
        "some unknown package manager is being used !! or yarn version 1 or 2 is being used",
      );
    }
  } else {
    console.warn(
      "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
    );
  }
}
