import { IEntityModel } from "../config/dbModels/interfaces/Entity.ts";
import { query } from "../config/util/LogClient.ts";
import { SqlQuery } from "./interfaces/sql.ts";

export const selectEntity: SqlQuery<IEntityModel> = async (params, client) => {
  const model: IEntityModel = params.model;
  const label = "Entity: Select";
  const sql = `select 
        entity_id
      , entity_type
      , entity_name
      , entity_ic_details
      , contact_details
      , address_details
      , address_postcode
      , address_city
      , address_state
      , note
    from entities 
      where entity_id = $entity_id 
      and entity_type = $entity_type;`;

  return await query(client, label, sql, { ...model });
};

export const updateEntity: SqlQuery<IEntityModel> = async (params, client) => {
  const model: IEntityModel = params.model;
  const label = "Entity: Update";
  const sql = `update entities set
      entity_name = $entity_name
    , entity_ic_details = $entity_ic_details
    , contact_details = $contact_details
    , address_details = $address_details
    , address_postcode = $address_postcode
    , address_city = $address_city
    , address_state = $address_state
    , note = $note
    where entity_id = $entity_id 
    and entity_type = $entity_type
    returning entity_id;`;

  return await query(client, label, sql, { ...model });
};

export const createEntity: SqlQuery<IEntityModel> = async (params, client) => {
  const model: IEntityModel = params.model;
  const label = "Entity: Insert";
  const sql = `insert into entities (
      entity_name       
    , entity_type
    , entity_ic_details 
    , contact_details   
    , address_details   
    , address_postcode  
    , address_city      
    , address_state     
    , note              
  ) values (
      $entity_name
    , $entity_type
    , $entity_ic_details
    , $contact_details
    , $address_details
    , $address_postcode
    , $address_city
    , $address_state
    , $note
  ) returning entity_id;`;
  return await query(client, label, sql, { ...model });
};

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
