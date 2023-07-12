import { getQuery } from "oak/helpers.ts";
import { Context, Next, Router } from "oak/mod.ts";
import { Pool } from "pg/mod.ts";
import { entityDtoFromPayload } from "#db/models/EntityDto.ts";
import {
  getIndividual,
  patchEntity,
  putEntity,
} from "#services/EntityService.ts";
import { consoleDebug, consoleError } from "#util/Console.ts";
import { apiBad, apiInternalError, apiOk, customBody } from "#util/HTTP.ts";
import { ConsoleTags } from "../util/globalEnums.ts";
import { HTTP_METHODS } from "https://deno.land/std@0.188.0/http/method.ts";
import { BODY_TYPES } from "https://deno.land/x/oak@v12.5.0/util.ts";

const withBasePath = (path: string) => `/api/${path}`;

export const routeEntity = (router: Router) => {
  router.get(withBasePath("individual"), hasParamsId, getIndividualRoute);
  router.patch(withBasePath("individual"), hasParamsId, patchIndividualRoute);
  router.post(withBasePath("individual"), postIndividualRoute);
};

// NOTE:
// 1. validation error logged here
// 2. http response

const hasParamsId = async (context: Context, next: Next) => {
  // GET
  const params = getQuery(context);
  const isValidParams = Number(params.id) > 0;
  consoleDebug("EntityController: hasParamsId, params: ", params, [
    ConsoleTags.ENTITY,
  ]);
  if (["GET"].includes(context.request.method) && isValidParams) {
    await next();
    return;
  }

  // POST/ PATCH
  const value = await context.request.body({ type: "json" }).value;
  const isValidBody = Number(value.entityId) > 0;
  if (["PATCH", "POST"].includes(context.request.method) && isValidBody) {
    await next();
    return;
  }

  return apiBad(context, { body: customBody({}, "ERROR") });
};

export const getIndividualRoute = async (context: Context, next: Next) => {
  const pgPool: Pool = context.state.pgPool;
  const params = getQuery(context);
  try {
    const client = await pgPool.connect();
    const result = await getIndividual(client, Number(params.id));
    apiOk(context, { body: customBody(result?.[0] ?? {}) });
    await next();
  } catch (error) {
    consoleError("EntityController: getIndividualRoute, ", error);
    apiInternalError(context, { body: customBody({}) });
  }
};

export const patchIndividualRoute = async (context: Context, next: Next) => {
  const pgPool: Pool = context.state.pgPool;
  const value = await context.request.body({ type: "json" }).value;
  consoleDebug("EntityController: patchIndividualRoute, payload", value);

  const dto = entityDtoFromPayload(value);
  consoleDebug("EntityController: patchIndividualRoute, dto", dto);

  try {
    const client = await pgPool.connect();
    const result = await patchEntity(client, dto);
    consoleDebug("EntityController: postIndividualRoute, result: ", result);
    apiOk(context, { body: customBody(result?.[0] ?? {}) });
    await next();
  } catch (error) {
    consoleError("EntityController: patchIndividualRoute, ", error);
    apiInternalError(context, { body: customBody({}) });
  }
};

export const postIndividualRoute = async (context: Context, next: Next) => {
  const pgPool: Pool = context.state.pgPool;
  const value = await context.request.body({ type: "json" }).value;
  consoleDebug("EntityController: postIndividualRoute, payload:", value);

  const dto = entityDtoFromPayload(value);
  consoleDebug("EntityController: postIndividualRoute, dto: ", dto);

  try {
    const client = await pgPool.connect();
    const result = await putEntity(client, dto);
    consoleDebug("EntityController: postIndividualRoute, result: ", result);
    apiOk(context, { body: customBody(result?.[0] ?? {}) });
    await next();
  } catch (error) {
    consoleError("EntityController: postIndividualRoute, ", error);
    apiInternalError(context, { body: customBody({}) });
  }
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
