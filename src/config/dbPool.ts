import { Pool } from "pg/pool.ts";
import { dbParams } from "./dbParams.ts";

// `true` indicates lazy connections
const poolSize = 20;
const isConnCreationLazy = true;
export const pgPool = new Pool(dbParams, poolSize, isConnCreationLazy);
