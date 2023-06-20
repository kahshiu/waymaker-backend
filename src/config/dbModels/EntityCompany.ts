import { Entity } from "./Entity.ts";
import { EntityType } from "./enums/EntityType.ts";

export class EntityCompany extends Entity{
    public entity_type: EntityType

    constructor (params?: any) {
        const _params = params ?? {};
        super(_params);
        this.entity_type = EntityType.COMPANY;
    }
}