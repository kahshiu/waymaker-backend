import { ENV } from "../../config/env.ts";

export class LogAdapter {
    logger: any;

    constructor(logger: any) {
      this.logger = logger;
    }

    info(title: string, message?: any) {
      this.logger.info(title, message);
    }

    debug(title: string, message?: any) {
      if(ENV === "development") {
         this.logger.debug(title, message);
      }
    }

    warn(title: string, message?: any) {
       this.logger.warn(title, message);
    }

    error(title: string, message?: any) {
       this.logger.error(title, message);
    }
}
