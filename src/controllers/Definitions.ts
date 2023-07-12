import { Context } from "oak/context.ts";
import { Next } from "oak/middleware.ts";
import { Router } from "oak/router.ts";
import { MYStates } from "#db/models/Definitions.ts";
import { apiOk, customBody } from "#util/HTTP.ts";

const withBasePath = (path: string) => `/api/definitions/${path}`;

export const routeDefinitions = (router: Router) => {
  router.get(withBasePath("states"), statesRoute);
};

export const statesRoute = async (context: Context, next: Next) => {
  const result = MYStates;
  apiOk(context, { body: customBody(result) });
  await next();
};
