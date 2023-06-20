import { EntityType } from "../../enums/EntityType.ts";
import { EntityDto } from "./EntityDto.ts";

export class IndividualDto extends EntityDto {
    public readonly entityType = EntityType.INDIVIDUAL;

    constructor (params?: any) {
        super(params);
    }
}