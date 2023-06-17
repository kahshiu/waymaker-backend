import { Application, Router, ResponseBody } from "./deps.ts";
import { LogAdapter, LogMiddleware } from "./middleware/logger/LogAdapter.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const HeckName = "HeckerApp";
const HeckApp = new Application();
const HeckPort = 8000;
const HeckLogger = new LogAdapter(console); 


const client = new Client({
  hostname: Deno.env.get("DB_HOST"),
  port: Deno.env.get("DB_PORT"),
  user: Deno.env.get("DB_USERNAME"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_DBNAME"),
});
await client.connect();

const array_result = await client.queryArray("select version();");
await client.end();


const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = {greeting: "hello world 1234124"}
})
router.get("/version", (ctx) => {
  ctx.response.body = {postgresql: array_result}
})

HeckApp.use(LogMiddleware(HeckLogger));
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