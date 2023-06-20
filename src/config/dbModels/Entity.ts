import { IAddressDetails } from "./interfaces/IAddressDetails.ts";
import { IContactDetails } from "./interfaces/IContactDetails.ts";
import { IEntity } from "./interfaces/IEntity.ts";

export class Entity implements IEntity { 
    public entity_id: number;
    public entity_name: string;
    public contact_details: IContactDetails;
    public address_details: IAddressDetails;
    public address_postcode: string; 
    public address_city: number;
    public address_state: number; 

    constructor(params?: any) {
        const _params = params ?? {};
        this.entity_id = _params?.entityId ?? -1;
        this.entity_name = _params?.entityName ?? "";
        this.contact_details = {
            phone1: _params.phone1 ?? "",
            note1: _params.note1 ?? "",
            phone2: _params.phone2 ?? "",
            note2: _params.note2 ?? "",
        }
        this.address_details = {
            address1: _params.address1 ?? "",
            address2: _params.address2 ?? "",
            address3: _params.address3 ?? "",
        }
        this.address_postcode = _params.postcode ?? "";
        this.address_city = _params.addressCity ?? null;
        this.address_state = _params.addressState ?? null;
    }
}