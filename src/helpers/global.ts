// NOTE: relative to server.ts
const globalJson = "./json";

export const jsonFolder = (path: string) => {
  return `${globalJson}/${path}`;
};
