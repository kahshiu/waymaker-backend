import { jsonFolder } from "./global.ts";

export const readJson = async (filePath: string) => {
  const jsonPath = jsonFolder(filePath);
  return JSON.parse(await Deno.readTextFile(jsonPath));
};
export const writeJson = async <TContent>(
  filePath: string,
  content: TContent
) => {
  const jsonPath = jsonFolder(filePath);
  await Deno.writeTextFile(jsonPath, JSON.stringify(content, undefined, 2));
};
