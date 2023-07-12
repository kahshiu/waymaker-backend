import { Context, Next, Router } from "oak/mod.ts";
import { start, pause, resume } from "#services/CronService.ts";
import { apiOk, customBody } from "#util/HTTP.ts";

const withBasePath = (path: string) => `/cron/${path}`;

export const routeCron = (router: Router) => {
  router.get(withBasePath("start"), startRoute);
  router.get(withBasePath("pause"), pauseRoute);
  router.get(withBasePath("resume"), resumeRoute);
};

export const startRoute = async (context: Context, next: Next) => {
  start();
  const result = { done: true };
  apiOk(context, { body: customBody(result) });
  await next();
};

export const pauseRoute = async (context: Context, next: Next) => {
  pause();
  const result = { done: true };
  apiOk(context, { body: customBody(result) });
  await next();
};

export const resumeRoute = async (context: Context, next: Next) => {
  resume();
  const result = { done: true };
  apiOk(context, { body: customBody(result) });
  await next();
};
