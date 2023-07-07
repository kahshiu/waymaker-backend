// import { IAddressDetails } from "./Address.ts";
// import { IContactDetails } from "./Contact.ts";

import { EntityType } from "../enums.ts";

export type Nullable<TData> = null | TData;

export interface IEntityDto {
  // personal details
  entityId: number;
  entityType: Nullable<EntityType>;
  entityName: string;
  entityIcType: Nullable<number>;
  entityIc: Nullable<string>;

  // contact details
  mobileNo: Nullable<string>;
  officeNo: Nullable<string>;
  email: Nullable<string>;

  // address details
  address1: Nullable<string>;
  address2: Nullable<string>;
  address3: Nullable<string>;
  addressPostcode: Nullable<string>;
  addressCity: Nullable<string>;
  addressState: Nullable<number>;

  // additional
  note: Nullable<string>;
}

export interface IEntityModel {
  entity_id: number;
  entity_type: Nullable<number>;
  entity_name: string;
  entity_ic_details: IIC;
  contact_details: IContactModel;
  address_details: IAddressModel;
  address_postcode: Nullable<string>;
  address_city: Nullable<string>;
  address_state: Nullable<number>;
  note: Nullable<string>;
}

export interface IIC {
  ic_type: Nullable<number>;
  ic_no: Nullable<string>;
}

export interface IContactModel {
  mobile_no: Nullable<string>;
  office_no: Nullable<string>;
  email: Nullable<string>;
}

export interface IAddressModel {
  address1: Nullable<string>;
  address2: Nullable<string>;
  address3: Nullable<string>;
}
