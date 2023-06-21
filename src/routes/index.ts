import type { Router } from "oak/mod.ts";
import { Diagnostic } from "./Diagnostic.ts";
import { EntityController } from "./EntityController.ts";

export const registerAll = (router: Router) => {
    new EntityController().registerRoutes(router);
    new Diagnostic().registerRoutes(router);
}