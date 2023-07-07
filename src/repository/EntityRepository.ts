import {
  IEntityDto,
  IEntityModel,
} from "../config/dbModels/interfaces/Entity.ts";
import { query } from "../config/util/LogClient.ts";
import { SqlQuery } from "./interfaces/sql.ts";

export const selectEntity: SqlQuery<IEntityDto, IEntityModel> = async (
  params,
  client
) => {
  const dto: IEntityDto = params.dto;
  const label = "Entity: Select";
  const sql = `select 
      entity_id,
      entity_type,
      entity_name,
      entity_ic_details,
      contact_details,
      address_details,
      address_postcode,
      address_city,
      address_state,
      note
    from entities 
      where entity_id = $entityId 
      and entity_type = $entityType;`;

  return await query(client, label, sql, { ...dto });
};

/*
    text: "select 
      entity_id,
      entity_type,
      entity_name,
      entity_ic_details,
      contact_details,
      address_details,
      address_postcode,
      address_city,
      address_state,
      note
    from entities 
      where entity_id = $entity_id 
      and entity_type = $entity_type;",
      */

/*
  public patchEntity: SqlEntity = async (params, client?) => {
    const _ent: EntityIndividual | EntityCompany = params.ent ?? {};
    const _cols = params.cols ?? this.columnsMap.get("ALL");
    const _client = client ?? (await pgPool.connect());

    return new DebugDB(_client as PoolClient).queryObject(
      "EntityRepo",
      `update entities set 
        entity_name = '${_ent.entity_name}'
      where entity_id = ${_ent.entity_id} 
      and entity_type = ${_ent.entity_type}
      returning ${_cols}
      ;`
    );
  };
  */

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
