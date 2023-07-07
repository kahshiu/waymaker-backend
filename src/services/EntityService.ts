import { EntityType } from "../config/dbModels/enums.ts";
import { selectEntity, updateEntity } from "../repository/EntityRepository.ts";
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
  const label = serviceName("getEntity");
  const model = entityDtoToModel(dto);
  console.log("model: ", dto, model);

  const client = await pgPool.connect();
  try {
    await updateEntity({ model }, client);
    return;
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

/*

    async patchEntity (dto: IndividualDto | CompanyDto) {
        const methodName = "patchEntity";
        const label = `${this.serviceName}.${methodName}`;
        const ent = dto.entityType === EntityType.COMPANY? 
            new EntityCompany(dto): 
            new EntityIndividual(dto);

        try {
            const result = await this.entityRepository.patchEntity({ ent });
            return result?.rows ?? [];

        } catch (e) {
            LogConsole.error(label, e);
        }
    }
    */
