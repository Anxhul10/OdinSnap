#!/usr/bin/env node
import { checkPkgExist } from "@/packages/cliHelpers/checkPkgExist";
import { generateStats } from "@/packages/cliHelpers/generateStats";
import { mkdir } from "@/packages/cliHelpers/mkdir";
import fs from "fs";

export async function runner() {
  const res = checkPkgExist("./package.json", "loki");
  if (res) {
    mkdir(".OdinSnap");
    await generateStats();

    // checks project is monorepo or not
    fs.stat("dependency-graph.json", function (err, _stat) {
      if (err == null) {
        console.log("Monorepo");
      } else if (err.code === "ENOENT") {
        // file does not exist
        console.log("Not a Monorepo");
      } else {
        console.log("Some other error: ", err.code);
      }
    });
  } else {
    console.warn(
      "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
    );
  }
}
