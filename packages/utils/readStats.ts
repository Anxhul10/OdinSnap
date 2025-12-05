import { createReadStream } from "fs";

import { parseChunked } from "@discoveryjs/json-ext";

export const readStatsFile = async (filePath: string) => {
  return parseChunked(createReadStream(filePath));
};
