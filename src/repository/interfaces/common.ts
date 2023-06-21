import { PoolClient, Transaction } from "pg/mod.ts";

export interface QueryParams {
    text: string; 
    fields: string[]
}
export interface SqlQuery<IDtoVals, IEntVals, IResult> {
    (
        params: {
            cols?: string[], 
            dto: IDtoVals, // for insert, update, filters
        }, 
        client?: PoolClient | Transaction
    ): Promise<IResult>
}
export interface QueryObject<TObject> {
    query: any;
    command: string;
    rowCount: number;
    warnings: any[];
    columns: string[];
    rows: TObject[]
}