const DB_HOST = Deno.env.get("DB_HOST");
const DB_PORT = Deno.env.get("DB_PORT");
const DB_USERNAME = Deno.env.get("DB_USERNAME");
const DB_PASSWORD = Deno.env.get("DB_PASSWORD");
const DB_DBNAME = Deno.env.get("DB_DBNAME");

export {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DBNAME
}