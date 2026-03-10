/* eslint-disable  @typescript-eslint/no-explicit-any */
import { writeFile } from "fs/promises";
import { type IGetStats } from "../types/IGetStats";
import { readStatsFile } from "./readStats.js";

const isUserCode = (module: { name: string }) => {
  if (!module.name) return false;
  const isWebpackInternal = module.name.startsWith("(webpack)");
  const isNodeModuleRuntime =
    module.name.includes("node_modules") ||
    module.name.includes("webpack/runtime/");
  return !isWebpackInternal && !isNodeModuleRuntime;
};

export const trimStats = async (filePath: string, newFileName: string) => {
  const getStats: IGetStats = await readStatsFile(filePath);
  const trimmedStats = getStats.modules
    .filter((module) => isUserCode(module))
    .map((value: Record<string, any>) => {
      return ["name", "id", "reasons"].reduce<Record<string, any>>(
        (result, key) => {
          if (key === "reasons") {
            result[key] = value[key].map(
              (reasonObj: { moduleName: string; moduleId: string }) => {
                return {
                  moduleName: reasonObj.moduleName,
                  moduleId: reasonObj.moduleId,
                };
              },
            );
          } else {
            result[key] = value[key];
          }
          return result;
        },
        {},
      );
    });
  try {
    const trimmedJSON = JSON.stringify({ modules: trimmedStats }, null, 4);
    await writeFile(newFileName, trimmedJSON);
    return trimmedJSON;
  } catch (error) {
    console.log(error);
    console.error("Error occured while writing file ...");
  }
};
