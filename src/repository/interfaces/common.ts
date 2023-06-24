import { PoolClient, Transaction } from "pg/mod.ts";
import { QueryObjectResult } from "pg/query/query.ts";
export interface SqlQuery<IEntVals> {
    (
        params: {
            ent: IEntVals, // for insert, update, filters
            cols?: string[]
        }, 
        client?: PoolClient | Transaction
    ): Promise<QueryObjectResult<IEntVals>>
}