import type { Router } from "oak/mod.ts";
import { Diagnostic } from "./Diagnostic.ts";
import { routeEntity } from "./EntityController.ts";

export const registerAll = (router: Router) => {
  routeEntity(router);
  new Diagnostic().registerRoutes(router);
};
