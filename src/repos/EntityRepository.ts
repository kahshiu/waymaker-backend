import { logSql } from "#util/logger.ts";
import { EntityType } from "../db/dbEnums.ts";
import { IEntityModel } from "../db/models/interfaces/Entity.ts";
import { consoleDebug } from "../util/Console.ts";
import { SqlQuery } from "./interfaces/sql.ts";

export const selectEntity: SqlQuery<IEntityModel> = async (client, params) => {
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

  return await logSql(client, label, sql, { ...model });
};

export const searchEntity: SqlQuery<IEntityModel> = async (client, params) => {
  const model: IEntityModel = params.model;
  const label = "Entity: Select";
  const entity_id = model.entity_id;
  const entity_type = model.entity_type ?? EntityType.INDIVIDUAL;
  const entity_name =
    model.entity_name?.length > 0 ? `%${model.entity_name}%` : "";
  const entity_ic_no =
    model.entity_ic_details?.ic_no && model.entity_ic_details?.ic_no?.length > 0
      ? `%${model.entity_ic_details?.ic_no}%`
      : "";
  const entity_email =
    model.contact_details?.email && model.contact_details?.email?.length > 0
      ? `%${model.contact_details?.email}%`
      : "";
  const entity_contact_no =
    model.contact_details?.mobile_no &&
    model.contact_details?.mobile_no?.length > 0
      ? `%${model.contact_details?.mobile_no}%`
      : "";
  const searchParams = {
    entity_id,
    entity_name,
    entity_ic_no,
    entity_email,
    entity_contact_no,
  };
  consoleDebug("tracing EntityRepository, searchEntity: ", searchParams);
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
      where ${entity_type} is null or entity_type = ${entity_type}
      and (
        (${entity_id} = -1 or entity_id = ${entity_id})
        and ('${entity_name}' = '' or entity_name ilike '${entity_name}')
        and ('${entity_ic_no}' = '' or entity_ic_details->>'ic_no' ilike '${entity_ic_no}')
        and ('${entity_email}' = '' or contact_details->>'email' ilike '${entity_email}')
        and ('${entity_contact_no}' = '' 
          or (
            contact_details->>'mobile_no' ilike '${entity_contact_no}'
            or contact_details->>'office_no' ilike '${entity_contact_no}'
          )
        )
      )
    order by entity_id
    limit 1000;
      `;

  return await logSql(client, label, sql, searchParams);
};

export const updateEntity: SqlQuery<IEntityModel> = async (client, params) => {
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

  return await logSql(client, label, sql, { ...model });
};

export const createEntity: SqlQuery<IEntityModel> = async (client, params) => {
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
  return await logSql(client, label, sql, { ...model });
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
