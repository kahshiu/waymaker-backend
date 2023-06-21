import { Application, Router } from "oak/mod.ts";
import { registerAll } from "./routes/index.ts";
import { LogConsole, LogMiddleware } from "./middleware/logger/LogHelpers.ts";

const HeckName = "HeckerApp";
const HeckApp = new Application();
const HeckPort = 8000;

const router: Router = new Router();
registerAll(router);

HeckApp.use(LogMiddleware(LogConsole));
HeckApp.use(router.routes());
HeckApp.use(router.allowedMethods());

/*
HeckApp.use(async (ctx, next) => {
  ctx.response.body = "Hello World!";
  await next();
});

HeckApp.use(async (ctx, next) => {
  const x: ResponseBody = await ctx.response.body;
  ctx.response.body = x as string + "\n something here asdfads";
  await next();
});
*/

HeckApp.addEventListener('listen', () => {
    console.log(`${HeckName} is now running at port: ${HeckPort}`)
})

await HeckApp.listen({ port: HeckPort });