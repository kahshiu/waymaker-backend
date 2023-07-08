import { EntityType } from "../config/dbModels/enums.ts";
import {
  createEntity,
  selectEntity,
  updateEntity,
} from "../repository/EntityRepository.ts";
import { pgPool } from "../config/dbPool.ts";
import {
  createEntityModel,
  entityDtoFromModel,
  entityDtoToModel,
} from "../config/dbModels/EntityDto.ts";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";
import { IEntityDto } from "../config/dbModels/interfaces/Entity.ts";

const serviceName = (method: string) => `EntityService::${method}`;

export const getEntity = async (entityId: number, entityType: EntityType) => {
  const label = serviceName("getEntity");
  const model = createEntityModel();
  model.entity_id = entityId;
  model.entity_type = entityType;

  const client = await pgPool.connect();
  try {
    const { rows } = await selectEntity({ model }, client);
    const result = rows.map((entity) => entityDtoFromModel(entity));
    return result;
  } catch (e) {
    LogConsole.error(label, e);
  } finally {
    client.release();
  }
};

export const patchEntity = async (dto: IEntityDto) => {
  const label = serviceName("patchEntity");
  const model = entityDtoToModel(dto);

  LogConsole.debug("debug: patchEntity, dto", dto);
  LogConsole.debug("debug: patchEntity, model", model);

  const client = await pgPool.connect();
  try {
    const { rows } = await updateEntity({ model }, client);
    const result = rows.map((entity) => entityDtoFromModel(entity));
    return result;
  } catch (e) {
    LogConsole.error(label, e);
  } finally {
    client.release();
  }
};

export const putEntity = async (dto: IEntityDto) => {
  const label = serviceName("putEntity");
  const model = entityDtoToModel(dto);
  LogConsole.debug("tracing putEntity, dto", dto);
  LogConsole.debug("tracing putEntity, model", model);

  const client = await pgPool.connect();
  try {
    const { rows } = await createEntity({ model }, client);
    LogConsole.debug("tracing putEntity, rows", rows);

    const result = rows.map((entity) => entityDtoFromModel(entity));
    return result;
  } catch (e) {
    LogConsole.error(label, e);
  } finally {
    client.release();
  }
};

export const getIndividual = async (entityId: number) => {
  return await getEntity(entityId, EntityType.INDIVIDUAL);
};
export const getCompany = async (entityId: number) => {
  return await getEntity(entityId, EntityType.COMPANY);
};
