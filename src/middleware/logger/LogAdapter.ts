import { cloneState } from "https://deno.land/x/oak@v12.5.0/structured_clone.ts";

export class LogAdapter {
    logger: any;

    constructor(logger: any) {
        this.logger = logger;
    }

    log(title: string, message?: any) {
       this.logger.log(title, message);
    }

    warn(title: string, message?: any) {
       this.logger.warn(title, message);
    }
}

export const LogMiddleware = (logger: LogAdapter) => {
    return async (ctx: any, next: any) => {
        const {ip, method, url} = ctx.request;
        const dt = new Date();
        const title = "LogAdapter,"; 
        const message = `{ timestamp: ${dt.toISOString()}, requester: ${ip}, url: HTTP ${method} "${url}" }`; 
        logger.log(title, message);
        await next();
    }
}