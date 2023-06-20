import { EntityType } from "../../enums/EntityType.ts";
import { EntityDto } from "./EntityDto.ts";

export class CompanyDto extends EntityDto {
    public readonly entityType = EntityType.COMPANY;

    constructor (params?: any) {
        super(params);
    }
}