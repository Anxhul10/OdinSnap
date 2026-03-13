import { execa } from "execa";

export async function getChangedFileLocal(headCommit: string) {
  // `git --no-pager diff --name-only --no-relative ${baseCommit} ${headCommit}`
  const { stdout } = await execa("git", [
    "--no-pager",
    "diff",
    "--name-only",
    "--no-relative",
    headCommit,
  ]);
  const changedFile = stdout.split("\n");
  return changedFile;
}
