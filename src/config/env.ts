export const ENV = Deno.env.get("ENV") ?? "development";
export const VERSION = 1;

export const DB_HOST = Deno.env.get("DB_HOST");
export const DB_PORT = Deno.env.get("DB_PORT");
export const DB_USERNAME = Deno.env.get("DB_USERNAME");
export const DB_PASSWORD = Deno.env.get("DB_PASSWORD");
export const DB_DBNAME = Deno.env.get("DB_DBNAME");
