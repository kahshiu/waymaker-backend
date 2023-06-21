import { CompanyDto } from "../config/dbModels/dtos/entity/CompanyDto.ts";
import { IndividualDto } from "../config/dbModels/dtos/entity/IndividualDto.ts";
import { routeChaining } from "../helpers/string.ts";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";
import { EntityRepository } from "../repository/EntityRepository.ts";

export class EntityService {
    private entityRepository: EntityRepository;
    public label = routeChaining("EntityService");

    constructor () {
        this.entityRepository = new EntityRepository();
    }

    async getCompany (entityId: number) {
        const label = this.label(".getCompany");
        const dto = new CompanyDto();
        dto.entityId = entityId;
        const params = { dto };
        try {
            const result = await this.entityRepository.selectCompany(params);
            LogConsole.debug(label, `command: ${result.command}, count: ${result.rowCount}`);
            LogConsole.warn(label, result.warnings);
            return result?.rows ?? [];

        } catch (e) {
            LogConsole.error(label, e);
        }
    }

    async getIndividual (entityId: number) {
        const label = this.label(".getIndividual");
        const dto = new IndividualDto();
        dto.entityId = entityId;
        const params = { dto }
        try {
            const result = await this.entityRepository.selectIndividual(params);
            LogConsole.debug(label, `command: ${result.command}, count: ${result.rowCount}`);
            LogConsole.warn(label, result.warnings);
            return result?.rows ?? [];

        } catch (e) {
            LogConsole.error(label, e);
        }
    }
}