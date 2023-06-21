import { CompanyDto } from "../config/dbModels/dtos/entity/CompanyDto.ts";
import { IndividualDto } from "../config/dbModels/dtos/entity/IndividualDto.ts";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";
import { EntityRepository } from "../repository/EntityRepository.ts";

export class EntityService {
    private entityRepository: EntityRepository;
    public serviceName = "EntityService";

    constructor () {
        this.entityRepository = new EntityRepository();
    }

    // NOTE: database errors logged here
    async getCompany (entityId: number) {
        const methodName = "getCompany";
        const label = `${this.serviceName}.${methodName}`;

        const dto = new CompanyDto();
        dto.entityId = entityId;
        const params = { dto };

        try {
            const result = await this.entityRepository.selectCompany(params);
            return result?.rows ?? [];

        } catch (e) {
            LogConsole.error(label, e);
        }
    }

    async getIndividual (entityId: number) {
        const methodName = "getIndividual";
        const label = `${this.serviceName}.${methodName}`;

        const dto = new IndividualDto();
        dto.entityId = entityId;
        const params = { dto }

        try {
            const result = await this.entityRepository.selectIndividual(params);
            return result?.rows ?? [];

        } catch (e) {
            LogConsole.error(label, e);
        }
    }
}