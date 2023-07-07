import { EntityType } from "../config/dbModels/enums.ts";
import { selectEntity } from "../repository/EntityRepository.ts";
import { pgPool } from "../config/dbPool.ts";
import {
  createEntityDto,
  entityDtoFromModel,
} from "../config/dbModels/EntityDto.ts";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";

export class EntityService {
  // private entityRepository: EntityRepository;
  public serviceName = "EntityService";

  constructor() {
    // this.entityRepository = new EntityRepository();
  }

  // NOTE: database errors logged here
  async getEntity(entityId: number, entityType: EntityType) {
    const methodName = "getEntity";
    const label = `${this.serviceName}.${methodName}`;

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
  }
  getIndividual(entityId: number) {
    return this.getEntity(entityId, EntityType.INDIVIDUAL);
  }
  getCompany(entityId: number) {
    return this.getEntity(entityId, EntityType.COMPANY);
  }

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
}
