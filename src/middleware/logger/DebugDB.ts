import { PoolClient } from "pg/client.ts";
import { QueryArguments } from "pg/query/query.ts";
import { LogService } from "./LogHelpers.ts";

// NOTE: 
// wrapper around pool-client to implement logging
export class DebugDB {
    client: PoolClient;

    constructor (client: PoolClient) {
        this.client = client;
    }

    public queryObject = async <TObject>(label: string, query: string, queryArgs?: QueryArguments) => {
        const result = await this.client.queryObject<TObject>(query, queryArgs);
        LogService(label, result);
        return result;
    }

} 