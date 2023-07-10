import { Context } from "oak/context.ts";
import { Router } from "oak/router.ts";
import { VERSION } from "../config/env.ts";

const withBasePath = (path: string) => `/api/diagnostic/${path}`;

export const routeDiagnostic = (router: Router) => {
  router.get(withBasePath("testing"), testingRoute);
  router.get(withBasePath("version"), versionRoute);
};

export const testingRoute = (ctx: Context) => {
  ctx.response.body = { greeting: "hello world from my-backend" };
};

export const versionRoute = (ctx: Context) => {
  ctx.response.body = { VERSION };
};
