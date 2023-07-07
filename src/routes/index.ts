import type { Router } from "oak/mod.ts";
import { routeDiagnostic } from "./Diagnostic.ts";
import { routeEntity } from "./EntityController.ts";

export const registerAll = (router: Router) => {
  routeEntity(router);
  routeDiagnostic(router);
};
