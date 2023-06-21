import { QueryObject } from "../../repository/interfaces/common.ts";
import { LogAdapter } from "./LogAdapter.ts";

export const LogConsole = new LogAdapter(console); 

export const LogService = <T>(label: string, result: QueryObject<T>) => {
    LogConsole.debug(`${label} command: `, result.command);
    LogConsole.debug(`${label} text: `, result.query.text);
    LogConsole.debug(`${label} count: `, result.rowCount);
    LogConsole.warn(`${label} warning: `, result.warnings);
}

export const LogMiddleware = (logger: LogAdapter) => {
    return async (ctx: any, next: any) => {
        const {ip, method, url} = ctx.request;
        const dt = new Date();
        const title = "LogAdapter,"; 
        const message = `{ timestamp: ${dt.toISOString()}, requester: ${ip}, url: HTTP ${method} "${url}" }`; 
        logger.info(title, message);
        await next();
    }
}
