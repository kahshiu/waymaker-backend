import { Context } from "oak/context.ts";
import { Router } from "oak/router.ts";
import { MYStates } from "../config/dbModels/Definitions.ts";
import { Next } from "https://deno.land/x/oak@v12.5.0/middleware.ts";
import { HTTP } from "../helpers/HTTP.ts";
import { HTTPPayload } from "../helpers/HTTPPayload.ts";

const withBasePath = (path: string) => `/api/definitions/${path}`;

export const routeDefinitions = (router: Router) => {
  router.get(withBasePath("states"), statesRoute);
};

export const statesRoute = async (ctx: Context, next: Next) => {
  const result = MYStates;
  HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
  await next();
};
