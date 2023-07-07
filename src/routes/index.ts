import type { Router } from "oak/mod.ts";
import { routeDefinitions } from "./Definitions.ts";
import { routeDiagnostic } from "./Diagnostic.ts";
import { routeEntity } from "./EntityController.ts";

export const registerAll = (router: Router) => {
  routeDefinitions(router);
  routeDiagnostic(router);
  routeEntity(router);
};
