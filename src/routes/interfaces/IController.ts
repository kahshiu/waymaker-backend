import type { Router } from "oak/mod.ts";

export interface IController {
    baseRoute: (route: string) => string;
    registerRoutes: (router: Router) => void
}