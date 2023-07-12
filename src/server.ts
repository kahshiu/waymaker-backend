import { Application } from "oak/application.ts";
import { Router } from "oak/router.ts";
import { Pool } from "pg/mod.ts";
import { registerRoutes } from "./controllers/index.ts";
import { withPool } from "./db/dbPool.ts";
import { consoleInfo } from "./util/Console.ts";
import { logRequest, logRequestDetails } from "./util/logger.ts";

const HeckName = "HeckerApp";
const HeckApp = new Application();
const HeckPort = 8000;

const router: Router = new Router();
registerRoutes(router);

HeckApp.use(logRequest);
HeckApp.use(logRequestDetails);
HeckApp.use(withPool);
HeckApp.use(router.routes());
HeckApp.use(router.allowedMethods());

HeckApp.addEventListener("listen", () => {
  consoleInfo(`${HeckName} actively serving at port:`, HeckPort);
});

await HeckApp.listen({ port: HeckPort });
