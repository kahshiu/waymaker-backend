import { EntityCompany } from "../config/dbModels/EntityCompany.ts";
import { EntityIndividual } from "../config/dbModels/EntityIndividual.ts";
import { CompanyDto } from "../config/dbModels/dtos/entity/CompanyDto.ts";
import { IndividualDto } from "../config/dbModels/dtos/entity/IndividualDto.ts";
import { pgPool } from "../config/dbPool.ts";
import { QueryObject, SqlQuery } from "./interfaces/common.ts";

type SqlIndividual = SqlQuery<IndividualDto, EntityIndividual, QueryObject<EntityIndividual>>
type SqlCompany = SqlQuery<CompanyDto, EntityCompany, QueryObject<EntityIndividual>>

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

    private selectEntity = async (params, client?) => {
        const _cols = params.cols ?? this.columnsMap.get("ALL");
        const _filters = params.dto;
        const _client = client ?? await pgPool.connect() 

        return _client.queryObject({
            text: `
                select d ${_cols}
                from entities 
                where entity_id = ${_filters.entityId}
            `,
            fields: _cols,
        })
    }

    public selectIndividual: SqlIndividual = (params, client?) => {
        return this.selectEntity(params, client);
    }
    public selectCompany: SqlCompany = (params, client?) => { 
        return this.selectEntity(params, client);
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
