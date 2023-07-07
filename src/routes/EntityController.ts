import { getQuery } from "oak/helpers.ts";
import { Context } from "oak/mod.ts";
import { Next } from "oak/middleware.ts";
import { Router } from "oak/router.ts";
import { HTTP } from "../helpers/HTTP.ts";
import { HTTPPayload } from "../helpers/HTTPPayload.ts";
import { getIndividual, patchEntity } from "../services/EntityService.ts";
import { entityDtoFromPayload } from "../config/dbModels/EntityDto.ts";

const withBasePath = (path: string) => `/api/${path}`;

export const routeEntity = (router: Router) => {
  router.get(withBasePath("individual/:id"), getIndividualRoute);
  router.patch(withBasePath("individual"), patchIndividualRoute);
};
/*
    router.patch("/individual/:id", (ctx: Context, next: Next) =>
      this.patchIndividual(ctx, next)
    );

    router.get("/company/:id", (ctx: Context, next: Next) =>
      this.getCompany(ctx, next)
    );
    */

// NOTE:
// 1. validation error logged here
// 2. http response

const isValidId = (ctx: Context) => {
  const { id } = getQuery(ctx, { mergeParams: true });
  return Number(id) > 0;
};

export const getIndividualRoute = async (ctx: Context, next: Next) => {
  const isValid = isValidId(ctx);
  if (!isValid) {
    HTTP.BadResponse(ctx, { data: { error: "Bad Request" } });
    return;
  }
  const id = ctx?.params?.id;
  const result = await getIndividual(id);
  HTTP.OkResponse(ctx, { payload: HTTPPayload(result?.[0] ?? {}) });
  await next();
};

export const patchIndividualRoute = async (ctx: Context, next: Next) => {
  const value = await ctx.request.body({ type: "json" }).value;

  const dto = entityDtoFromPayload(value);
  await patchEntity(dto);
  HTTP.OkResponse(ctx, { payload: HTTPPayload({}, "OK") });
  await next();
};

/*
  async getCompany(ctx: Context, next: Next) {
    const isValid = this.isValidId(ctx);
    if (!isValid) {
      HTTP.BadResponse(ctx, { data: { error: "Bad Request" } });
      return;
    }
    const entityId = ctx?.params?.id;
    const result = await this.entityService.getCompany(entityId);
    HTTP.OkResponse(ctx, { payload: HTTPPayload(result?.[0] ?? {}) });
    await next();
  }
  */
