import { Pool } from "pg/pool.ts";
import { dbParams } from "./dbParams.ts";

// `true` indicates lazy connections
const poolSize = 20;
const isConnCreationLazy = true;

let pgPool;
try {
  pgPool = new Pool(dbParams, poolSize, isConnCreationLazy);
} catch (e) {
  // throw e;
}

export { pgPool };
