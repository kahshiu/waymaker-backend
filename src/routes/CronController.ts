import { Context, Next, Router } from "oak/mod.ts";
import { start, pause, resume } from "../services/CronService.ts";
import { HTTP } from "../helpers/HTTP.ts";
import { HTTPPayload } from "../helpers/HTTPPayload.ts";

const withBasePath = (path: string) => `/cron/${path}`;

export const routeCron = (router: Router) => {
  router.get(withBasePath("start"), startRoute);
  router.get(withBasePath("pause"), pauseRoute);
  router.get(withBasePath("resume"), resumeRoute);
};

export const startRoute = async (ctx: Context, next: Next) => {
  start();
  const result = { done: true };
  HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
  await next();
};

export const pauseRoute = async (ctx: Context, next: Next) => {
  pause();
  const result = { done: true };
  HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
  await next();
};

export const resumeRoute = async (ctx: Context, next: Next) => {
  resume();
  const result = { done: true };
  HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
  await next();
};
