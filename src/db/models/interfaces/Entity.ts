// import { IAddressDetails } from "./Address.ts";
// import { IContactDetails } from "./Contact.ts";

import { EntityType } from "../../dbEnums.ts";
import { IAddressDto, IAddressModel } from "./Address.ts";
import { IContactDto, IContactModel } from "./Contact.ts";
import { IIdentityDto, IIdentityModel } from "./Identity.ts";
import { Nullable } from "./general.ts";

export interface IEntityDto extends IContactDto, IAddressDto, IIdentityDto {
  // personal details
  entityId: number;
  entityType: Nullable<EntityType>;
  entityName: string;

  // additional
  note: Nullable<string>;
}

export interface IEntityModel
  extends IContactModel,
    IAddressModel,
    IIdentityModel {
  entity_id: number;
  entity_type: Nullable<number>;
  entity_name: string;
  note: Nullable<string>;
}
