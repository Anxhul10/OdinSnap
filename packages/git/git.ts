import { execa } from "execa";
import { Context } from "../types/Context.js";

export async function getHeadBranch(context: Context) {
  const branch = context.payload.pull_request.head.ref;
  if (branch) return branch;
  return "error: no branch found";
}

export async function getBaseBranch(context: Context) {
  const branch = context.payload.pull_request.base.ref;
  if (branch) return branch;
  return "error: no branch found";
}

export async function getBaseCommit(context: Context) {
  const baseCommit = context.payload.pull_request.base.sha;
  if (baseCommit) return baseCommit;
  return "";
}

export async function getHeadCommit(context: Context) {
  const headCommit = context.payload.pull_request.head.sha;
  if (headCommit) return headCommit;
  return "";
}

export async function getChangedFile(context: Context) {
  const headCommit = await getHeadCommit(context);
  const baseCommit = await getBaseCommit(context);

  // `git --no-pager diff --name-only --no-relative ${baseCommit} ${headCommit}`
  const { stdout } = await execa("git", [
    "--no-pager",
    "diff",
    "--name-only",
    "--no-relative",
    baseCommit,
    headCommit,
  ]);
  const changedFile = stdout.split("\n");
  // console.log(headCommit);
  // see the changed files using the sha
  return changedFile;
}
