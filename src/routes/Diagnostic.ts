import { Router } from "oak/router.ts";
import { routeChaining } from "./helper.ts";
import { IController } from "./interfaces/IController.ts";
import { VERSION } from "../config/env.ts";

export class Diagnostic implements IController {
    public baseRoute: (route: string) => string;

    constructor () {
        this.baseRoute = routeChaining("/diagnostic");
    }

    registerRoutes (router: Router) {
        router.get(this.baseRoute("/testing"), this.testing);
        router.get(this.baseRoute("/version"), this.version);
    }

    testing (ctx) {
        ctx.response.body = { greeting: "hello world from my-backend" }
    }

    version (ctx) {
        ctx.response.body = { VERSION };
    }
}