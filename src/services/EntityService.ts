import { EntityCompany } from "../config/dbModels/EntityCompany.ts";
import { EntityIndividual } from "../config/dbModels/EntityIndividual.ts";
import { CompanyDto } from "../config/dbModels/dtos/entity/CompanyDto.ts";
import { IndividualDto } from "../config/dbModels/dtos/entity/IndividualDto.ts";
import { EntityType } from "../config/dbModels/enums/EntityType.ts";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";
import { EntityRepository } from "../repository/EntityRepository.ts";

export class EntityService {
    private entityRepository: EntityRepository;
    public serviceName = "EntityService";

    constructor () {
        this.entityRepository = new EntityRepository();
    }

    // NOTE: database errors logged here
    async getEntity (entityId: number, entityType: EntityType) {
        const methodName = "getEntity";
        const label = `${this.serviceName}.${methodName}`;

        const ent = entityType === EntityType.COMPANY? 
            new EntityCompany(): 
            new EntityIndividual();

        ent.entity_id = entityId;
        const params = { ent };

        try {
            const result = await this.entityRepository.selectEntity(params);
            return result?.rows ?? [];

        } catch (e) {
            LogConsole.error(label, e);
        }
    }
    getIndividual(entityId: number) { return this.getEntity(entityId, EntityType.INDIVIDUAL)} 
    getCompany(entityId: number) { return this.getEntity(entityId, EntityType.COMPANY)} 

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
}