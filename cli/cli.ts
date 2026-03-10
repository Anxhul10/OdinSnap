#!/usr/bin/env node
import { checkPkgExist } from "@/packages/cliHelpers/checkPkgExist";
import { generateStats } from "@/packages/cliHelpers/generateStats";
import { mkdir } from "@/packages/cliHelpers/mkdir";
import fs from "fs";
import dag from 'dag-rs';

export async function runner() {
  const res = checkPkgExist("./package.json", "loki");
  fs.stat("./OdinSnap", function (err, _stat) {
    if (err !== null && err.code === "ENOENT") {
      mkdir(".OdinSnap");
    } else {
      console.log(".OdinSnap exists");
    }
  });
  if (res) {
    console.log("wip...")
  } else {
    console.warn(
      "OdinSnap requires 'loki' to be installed as a Dependency for visual regression testing. Please install it to continue.",
    );
  }
}
