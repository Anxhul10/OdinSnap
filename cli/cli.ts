#!/usr/bin/env node
import { checkPkgExist } from "@/packages/cliHelpers/checkPkgExist";
import { mkdir } from "@/packages/cliHelpers/mkdir";
import fs from "fs";
import { execCommand } from "@/packages/utils/execCommand";
import { trimStats } from "@/packages/utils/trimStats";
import path from "path";
import { readStatsFile } from "@/packages/utils/readStats";
import { generateRegex } from "@/packages/cliHelpers/generateRegex";
import { getChangedFileLocal } from "@/packages/git/getChangedFileLocal";
import { execa } from "execa";

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
let barrelImports = new Array();
let depth: undefined | number = undefined;
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
  if (barrelImports != undefined) {
    for (const to_ignore of barrelImports) {
      if (filePath.includes(to_ignore)) {
        visited.add(filePath);
      }
    }
  }

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
  console.log("Ensure you are running Storybook at http://172.16.243.93:9001");

  console.log("\nOdinSnap configuration recommended for better accuracy.");
  console.log(
    "If OdinSnap detects too many components as affected, configure it in your package.json.\n",
  );
  console.log("See documentation:");
  console.log(
    "https://github.com/Anxhul10/OdinSnap/blob/chore/cli-init/README.md#odinsnap-configuration\n",
  );
  const headCommit = await execa`git rev-parse HEAD`;
  const changedFiles = await getChangedFileLocal(headCommit.stdout);
  const res = checkPkgExist("./package.json", "loki");
  fs.stat("./OdinSnap", function (err) {
    if (err !== null && err.code === "ENOENT") {
      mkdir(".OdinSnap");
    } else {
      console.log(".OdinSnap exists");
    }
  });
  if (changedFiles.length == 0) {
    console.log("No affected components");
  }
  let configDir = ".storybook";
  if (!fs.existsSync(".storybook") && fs.existsSync("storybook")) {
    configDir = "storybook";
  }
  if (res) {
    // non-monorepo project
    const packageJSON = await readStatsFile("package.json");
    if (packageJSON.odinsnap) {
      try {
        barrelImports = packageJSON.odinsnap["barrelImports"];
        depth = packageJSON.odinsnap.depth;
      } catch (e) {
        // do nothing
      }
    }
    await execCommand(
      `npx storybook build --output-dir storybook-static --config-dir ${configDir} --stats-json`,
    );

    const filePath = "./storybook-static/preview-stats.json";
    const trimmedName = path.join(".OdinSnap", "trimmed-stats.json");
    const componentStatsPath = "./storybook-static/index.json";

    await trimStats(filePath, trimmedName);
    const statsPath = trimmedName;

    const stats = await readStatsFile(statsPath);
    const componentStats = await readStatsFile(componentStatsPath);

    for (const filePath of changedFiles) {
      affectedComponent(filePath, stats);
      if (filePath.includes("stories")) {
        affectedPaths.add(filePath);
      }
    }
    for (const cmpPath of affectedPaths) {
      for (const [, value] of Object.entries(componentStats.entries)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const importPath = (value as any).importPath;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const title = (value as any).title;
        if (depth != undefined) {
          const componentName = cmpPath.split(path.sep)[depth];
          if (importPath.includes(`${path.sep}${componentName}${path.sep}`)) {
            componentTitle.add(title);
          }
        } else {
          if (importPath.includes(cmpPath)) {
            componentTitle.add(title);
          }
        }
      }
    }
    const regex = generateRegex(componentTitle);
    await execCommand(`npx loki test --storiesFilter="${regex}"`);
  } else {
    console.warn(
      "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
    );
  }
}
