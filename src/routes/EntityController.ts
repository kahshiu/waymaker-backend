import { Context } from "oak/mod.ts";
import { Next } from "oak/middleware.ts";
import { Router } from "oak/router.ts";
import { HTTP } from "../helpers/HTTP.ts";
import { HTTPPayload } from "../helpers/HTTPPayload.ts";
import { getIndividual } from "../services/EntityService.ts";

/*
export class EntityController implements IController {
  public baseRoute: (route: string) => string;

  constructor() {
    this.baseRoute = routeChaining("api");
  }
  */

const withBasePath = (path: string) => `/api/${path}`;

export const routeEntity = (router: Router) => {
  router.get(withBasePath("individual/:id"), getIndividualRoute);
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
  const entityId = ctx?.params?.id;
  return entityId > 0;
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

/*
  async patchIndividual(ctx: Context, next: Next) {
    const isValid = this.isValidId(ctx);
    if (!isValid) {
      HTTP.BadResponse(ctx, { data: { error: "Bad Request" } });
      return;
    }
    const { value } = ctx.request.body({ type: "json" });
    const dto = new IndividualDto(await value);
    dto.entityId = ctx?.params?.id;
    const result = await this.entityService.patchEntity(dto);
    HTTP.OkResponse(ctx, { payload: HTTPPayload(result?.[0] ?? {}) });
    await next();
  }

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
