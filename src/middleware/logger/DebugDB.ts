import { PoolClient } from "pg/client.ts";
import { QueryObject, QueryParams } from "../../repository/interfaces/common.ts";
import { LogService } from "./LogHelpers.ts";

// NOTE: 
// wrapper around pool-client to implement logging
export class DebugDB {
    client: PoolClient;

    constructor (client: PoolClient) {
        this.client = client;
    }

    public queryObject = async <TObject>(label: string, queryParams: QueryParams) => {
        const result = await this.client.queryObject<TObject>(queryParams);
        LogService(label, result as QueryObject<TObject>);
        return result;
    }

} 