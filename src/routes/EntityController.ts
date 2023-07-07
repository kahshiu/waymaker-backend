import { Context } from "oak/mod.ts";
import { Next } from "oak/middleware.ts";
import { Router } from "oak/router.ts";
import { IController } from "./interfaces/IController.ts";
import { routeChaining } from "../helpers/string.ts";
import { HTTP } from "../helpers/HTTP.ts";
import { EntityService } from "../services/EntityService.ts";
import { HTTPPayload } from "../helpers/HTTPPayload.ts";
// import { IndividualDto } from "../config/dbModels/dtos/entity/IndividualDto.ts";

export class EntityController implements IController {
  public baseRoute: (route: string) => string;
  public entityService: EntityService;

  constructor() {
    this.baseRoute = routeChaining("api/entity");
    this.entityService = new EntityService();
  }

  registerRoutes(router: Router) {
    router.get("/individual/:id", (ctx: Context, next: Next) =>
      this.getIndividual(ctx, next)
    );
    router.patch("/individual/:id", (ctx: Context, next: Next) =>
      this.patchIndividual(ctx, next)
    );

    router.get("/company/:id", (ctx: Context, next: Next) =>
      this.getCompany(ctx, next)
    );
  }

  // NOTE:
  // 1. validation error logged here
  // 2. http response
  /*
  private isValidId(ctx: Context) {
    const entityId = ctx?.params?.id;
    return entityId > 0;
  }
  */

  async getIndividual(ctx: Context, next: Next) {
    /*
    const isValid = this.isValidId(ctx);
    if (!isValid) {
      HTTP.BadResponse(ctx, { data: { error: "Bad Request" } });
      return;
    }
    const entityId = ctx?.params?.id;
    */
    const result = await this.entityService.getIndividual(1);
    HTTP.OkResponse(ctx, { payload: HTTPPayload(result?.[0] ?? {}) });
    await next();
  }

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
}
