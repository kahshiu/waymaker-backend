import { QueryObjectResult } from "pg/query/query.ts";
import {
  ConsoleTags,
  ConsoleModes,
  Environments,
  ConsoleTagTypes,
} from "./globalEnums.ts";
import { consoleMode, consoleTags, environment } from "./globals.ts";
import { isNil, intersection } from "./misc.ts";

type TConsole = (title: string, message?: any, tags?: ConsoleTags[]) => void;

const isShow = (mode: ConsoleModes, tags?: ConsoleTags[]) => {
  const isLoggingAll = consoleMode === ConsoleTagTypes.ALL;
  const isLoggingTag = consoleMode === ConsoleTagTypes.TAGS;
  const noTag = isNil(tags);
  const hasTag = intersection(tags ?? [], consoleTags);
  const shouldLog = noTag || isLoggingAll || (isLoggingTag && hasTag);

  const isDev = environment === Environments.DEVELOPEMNT;
  const isProd = environment === Environments.DEVELOPEMNT;

  const isLog = mode === ConsoleModes.LOG;
  const isInfo = mode === ConsoleModes.INFO;
  const isDebug = mode === ConsoleModes.DEBUG;

  let toShow = false;
  if (isDebug) toShow = isDev && shouldLog;
  else if (isLog || isInfo) toShow = (isDev || isProd) && shouldLog;
  return toShow;
};

export const consoleLog: TConsole = (title, message, tags) => {
  if (isShow(ConsoleModes.LOG, tags)) console.log(title, message);
};

export const consoleInfo: TConsole = (title, message, tags) => {
  if (isShow(ConsoleModes.INFO, tags)) console.info(title, message);
};

export const consoleDebug: TConsole = (title, message, tags) => {
  if (isShow(ConsoleModes.DEBUG, tags)) console.debug(title, message);
};

export const consoleError: TConsole = (title, message) => {
  console.error(title, message);
};

export const consoleSql: TConsole = <TResult>(
  title: string,
  message: QueryObjectResult<TResult>,
  tags?: ConsoleTags[]
) => {
  if (isShow(ConsoleModes.INFO, tags)) {
    console.info(`${title} command: `, message.command);
    console.info(`${title} text: `, message.query.text, message.query.args);
    console.info(`${title} count: `, message.rowCount);
    if (message.warnings.length > 0) {
      console.info(`${title} warning: `, message.warnings);
    }
  }
};
