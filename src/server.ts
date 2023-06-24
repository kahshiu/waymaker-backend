import { Application, Router } from "oak/mod.ts";
import { registerAll } from "./routes/index.ts";
import { LogConsole, LogMiddleware } from "./middleware/logger/LogHelpers.ts";

const HeckName = "HeckerApp";
const HeckApp = new Application();
const HeckPort = 8000;

HeckApp.addEventListener('listen', () => {
  LogConsole.info(HeckName, `actively serving at port: ${HeckPort}`)
})

const router: Router = new Router();
registerAll(router);
// router.param

HeckApp.use(LogMiddleware(LogConsole));
HeckApp.use(router.routes());
HeckApp.use(router.allowedMethods());

await HeckApp.listen({ port: HeckPort });

HeckApp.use(async (ctx, next) => {
  console.log("tracing error: ", ctx.request.secure, ctx.request.url, ctx.request.headers);
  ctx.response.body = "Hello World!";
  await next();
});

/*
HeckApp.use(async (ctx, next) => {
  const x: ResponseBody = await ctx.response.body;
  ctx.response.body = x as string + "\n something here asdfads";
  await next();
});
*/

