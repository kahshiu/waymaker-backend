import { Client, PoolClient } from "pg/mod.ts";
import { EntityType } from "#db/dbEnums.ts";
import {
  createEntityModel,
  entityDtoFromModel,
  entityDtoToModel,
} from "#db/models/EntityDto.ts";
import { IEntityDto } from "#db/models/interfaces/Entity.ts";
import {
  selectEntity,
  updateEntity,
  createEntity,
} from "#repos/EntityRepository.ts";
import { consoleError, consoleDebug } from "../util/Console.ts";

export const getEntity = async (
  client: PoolClient,
  entityId: number,
  entityType: EntityType
) => {
  const model = createEntityModel();
  model.entity_id = entityId;
  model.entity_type = entityType;

  try {
    const { rows } = await selectEntity(client, { model });
    const result = rows.map((entity) => entityDtoFromModel(entity));
    consoleDebug("EntityService: getEntity, result: ", result);
    return result;
  } catch (error) {
    consoleError("EntityService: getEntity, ", error);
  } finally {
    client.release();
  }
};

export const patchEntity = async (client: PoolClient, dto: IEntityDto) => {
  const model = entityDtoToModel(dto);
  consoleDebug("EntityService: patchEntity, dto", dto);
  consoleDebug("EntityService: patchEntity, model", model);

  try {
    const { rows } = await updateEntity(client, { model });
    const result = rows.map((entity) => entityDtoFromModel(entity));
    return result;
  } catch (error) {
    consoleError("EntityService: patchEntity, ", error);
  } finally {
    client.release();
  }
};

export const putEntity = async (client: PoolClient, dto: IEntityDto) => {
  const model = entityDtoToModel(dto);
  consoleDebug("EntityService: putEntity, dto", dto);
  consoleDebug("EntityService: putEntity, model", model);

  try {
    const { rows } = await createEntity(client, { model });
    consoleDebug("EntityService: putEntity, rows", model);

    const result = rows.map((entity) => entityDtoFromModel(entity));
    return result;
  } catch (error) {
    consoleError("EntityService: putEntity, ", error);
  } finally {
    client.release();
  }
};

export const getIndividual = async (client: PoolClient, entityId: number) => {
  return await getEntity(client, entityId, EntityType.INDIVIDUAL);
};

export const getCompany = async (client: PoolClient, entityId: number) => {
  return await getEntity(client, entityId, EntityType.COMPANY);
};
