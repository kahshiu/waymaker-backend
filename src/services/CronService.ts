import { Cron } from "cron/dist/croner.js";

const serviceName = (method: string) => `CronService::${method}`;

const job = new Cron("*/2 * * * * *");

export const start = () => {
  job.schedule(() => {
    console.log("This will run every fifth second");
  });
};

export const pause = () => {
  job.pause();
};

export const resume = () => {
  job.resume();
};
