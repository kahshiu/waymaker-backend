import { Context } from "oak/mod.ts";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";

export class HTTP {
    static BaseResponse (ctx: Context, params: any) {
        const _contentType = params?.contentType ?? "application/json";
        const _statusCode = params?.statusCode ?? 200;
        const _payload = params?.payload ?? {};

        // ctx.response.headers.set("Content-Type", _contentType)
        ctx.response.status = _statusCode;
        ctx.response.type = _contentType;
        ctx.response.body = _payload;
    } 

    static OkResponse (ctx: Context, params: any) {
        this.BaseResponse(ctx, {
            ...params,
            statusCode: 200,
        })
    } 

    static NoContentResponse (ctx: Context, params: any) {
        this.BaseResponse(ctx, {
            ...params,
            statusCode: 204,
        })
    } 

    static BadResponse (ctx: Context, params: any) {
        LogConsole.error("Bad request: ", ctx.request.url);
        this.BaseResponse(ctx, {
            ...params,
            statusCode: 400,
        })
    } 

    static UnauthResponse (ctx: Context, params: any) {
        LogConsole.error("Unauthenticated request: ", ctx.request.url);
        this.BaseResponse(ctx, {
            ...params,
            statusCode: 401,
        })
    } 

    static ForbiddenResponse (ctx: Context, params: any) {
        LogConsole.error("Forbidden request: ", ctx.request.url);
        this.BaseResponse(ctx, {
            ...params,
            statusCode: 403,
        })
    } 

    static NotFoundResponse (ctx: Context, params: any) {
        LogConsole.error("Request not found: ", ctx.request.url);
        this.BaseResponse(ctx, {
            ...params,
            statusCode: 404,
        })
    } 

    static InternalErrorResponse (ctx: Context, params: any) {
        LogConsole.error("Internal error request: ", ctx.request.url);
        this.BaseResponse(ctx, {
            ...params,
            statusCode: 500,
        })
    } 

    static NotImplementedResponse (ctx: Context, params: any) {
        LogConsole.error("Not implemented: ", ctx.request.url);
        this.BaseResponse(ctx, {
            ...params,
            statusCode: 501,
        })
    } 
}