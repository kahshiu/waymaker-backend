import { CompanyDto } from "../config/dbModels/dtos/entity/CompanyDto.ts";
import { IndividualDto } from "../config/dbModels/dtos/entity/IndividualDto.ts";
import { LogAdapter } from "../middleware/logger/LogAdapter.ts";
import { LogConsole } from "../middleware/logger/LogSingleton.ts";
import { EntityRepository } from "../repository/EntityRepository.ts";

export class EntityService {
    private entityRepository: EntityRepository;

    constructor () {
        this.entityRepository = new EntityRepository();
    }

    async getCompany (entityId: number) {
        const label = "EntityService.getCompany";
        const dto = new CompanyDto();
        dto.entityId = entityId;
        const params = {
            dto,
        };
        try {
            const result = await this.entityRepository.selectCompany(params);
            LogConsole.info(label, result.query);
            return result;
        } catch (e) {
            LogConsole.error(label, e);
        }
    }

    async getIndividual (entityId: number) {
        const dto = new IndividualDto();
        dto.entityId = entityId;
        const params = {
            dto,
        }
        try {
            const result = await this.entityRepository.selectIndividual(params);
            return result;

        } catch (e) {
            console.log("logging", e)
        }
    }
}