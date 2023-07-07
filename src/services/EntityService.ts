import { EntityType } from "../config/dbModels/enums.ts";
import { selectEntity } from "../repository/EntityRepository.ts";
import { pgPool } from "../config/dbPool.ts";
import {
  createEntityDto,
  entityDtoFromModel,
} from "../config/dbModels/EntityDto.ts";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";

const serviceName = (method: string) => `EntityService::${method}`;

export const getEntity = async (entityId: number, entityType: EntityType) => {
  const label = serviceName("getEntity");

  const dto = createEntityDto();
  dto.entityId = entityId;
  dto.entityType = entityType;

  const client = await pgPool.connect();

  try {
    const { rows } = await selectEntity({ dto }, client);
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
