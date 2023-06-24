import { PoolClient } from "pg/mod.ts";
import { EntityCompany } from "../config/dbModels/EntityCompany.ts";
import { EntityIndividual } from "../config/dbModels/EntityIndividual.ts";
import { pgPool } from "../config/dbPool.ts";
import { SqlQuery } from "./interfaces/common.ts";
import { DebugDB } from "../middleware/logger/DebugDB.ts";

type SqlEntity = SqlQuery<EntityIndividual | EntityCompany>

export class EntityRepository {
    public columnsMap = new Map();

    constructor () {
        this.columnsMap.set(
            "ALL", 
            [
                "entity_id",
                "entity_type",
                "entity_name",
                "contact_details",
                "address_details",
                "address_postcode",
                "address_city",
                "address_state",
            ]
        )
    }

    public selectEntity: SqlEntity = async (params, client?) => {
        const _ent: EntityIndividual| EntityCompany = params.ent ?? {};
        const _cols = params.cols ?? this.columnsMap.get("ALL");
        const _client = client ?? await pgPool.connect();

        return new DebugDB(_client as PoolClient).queryObject(
            "EntityRepo ",
            `select 
                ${_cols} 
            from entities 
            where entity_id = ${_ent.entity_id} 
            and entity_type = ${_ent.entity_type};`
        )
    }

    public patchEntity: SqlEntity = async (params, client?) => {
        const _ent: EntityIndividual| EntityCompany = params.ent ?? {};
        const _cols = params.cols ?? this.columnsMap.get("ALL");
        const _client = client ?? await pgPool.connect() 

        return new DebugDB(_client as PoolClient).queryObject(
            "EntityRepo ",
            `update entities set 
                entity_name = '${_ent.entity_name}'
            where entity_id = ${_ent.entity_id} 
            and entity_type = ${_ent.entity_type}
            returning ${_cols}
            ;`
        )
    }
}

/*
const selectRelation = async (params: any, client?: PoolClient | Transaction) => {
  const { cols, filters } = params; 
  const _client = client ?? await pgPool.connect(); 
  return _client.queryObject`select * 
    from relations 
    where parent_id = ${filters.parentId}`;
}

  const client = await pgPool.connect();
  const client2 = await pgPool.connect();
  const data = await selectEntity({filters:{entity_id: 1}}, client);
  await client.release();
  await client2.release();

  ctx.response.body = {data}

*/
  // const transaction1 = client.createTransaction("trx1", {});
  // await transaction1.begin();
  // const data = await getEntity({filters:{entityId: 1}}, transaction1);
  // await transaction1.commit();
  // const arrayObject = await client.queryObject("select version();");

  //TODO: logger 
