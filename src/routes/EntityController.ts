import { Context } from "oak/mod.ts";
import { Next } from "oak/middleware.ts";
import { Router } from "oak/router.ts";
import { routeChaining } from "./helper.ts";
import { IController } from "./interfaces/IController.ts";
import { EntityService } from "../services/EntityService.ts";

export class EntityController implements IController {
    public baseRoute: (route: string) => string;
    public entityService: EntityService;

    constructor () {
        this.baseRoute = routeChaining("/entity");
        this.entityService = new EntityService();
    }

    registerRoutes (router: Router) {
        router.get("/individual/:id", async (ctx: Context, next: Next) => {
            await this.getIndividual(ctx);
            await next();
        });
        router.get("/company/:id", async (ctx: Context, next: Next) => {
            await this.getCompany(ctx);
            await next();
        });
    }

    async getIndividual(ctx: Context) {
        const entityId = ctx?.params?.id
        ctx.response.status
        // return error;
        const result = await this.entityService.getIndividual(entityId);
        ctx.response.body = {data: result.rows};
    }

    async getCompany(ctx: Context) {
        const entityId = ctx.params.id;
        const result = await this.entityService.getCompany(entityId);
        ctx.response.body = {data: result.rows};
    }
}

export class HTTP {
    constructor () {

    }

    static basicRespond (ctx: Context, params: any) {
        const _data = params?.data ?? {};
        const _contentType = params?.contentType ?? "application/json";

        ctx.response.headers.set("Content-Type", _contentType)
        ctx.response.body = _data;
    } 

    static okRespond (ctx, options) {

    } 
}