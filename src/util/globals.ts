import { Environments, ConsoleTags, ConsoleTagTypes } from "./globalEnums.ts";

// NOTE: path is relative to server.ts
const globalJson = "./json";

export const jsonFolder = (path: string) => {
  return `${globalJson}/${path}`;
};

export const environment: Environments = Environments.DEVELOPEMNT;
export const consoleMode: ConsoleTagTypes = ConsoleTagTypes.ALL;
export const consoleTags: ConsoleTags[] = [
  // NOTE: comment the irrelevent ones
  // ConsoleTags.MIDDLEWARE,
];
