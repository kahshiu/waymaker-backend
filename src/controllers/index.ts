import type { Router } from "oak/mod.ts";
import { routeAuth } from "./AuthController.ts";
import { routeCron } from "./CronController.ts";
import { routeDefinitions } from "./Definitions.ts";
import { routeDiagnostic } from "./Diagnostic.ts";
import { routeEntity } from "./EntityController.ts";

export const registerRoutes = (router: Router) => {
  routeAuth(router);
  routeCron(router);
  routeDefinitions(router);
  routeDiagnostic(router);
  routeEntity(router);
};
