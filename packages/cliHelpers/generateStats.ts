import { execCommand } from "../utils/execCommand.js";

export async function generateStats() {
  await execCommand("yarn build-storybook --stats-json .OdinSnap");
}
