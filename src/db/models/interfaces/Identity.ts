import { Nullable } from "./general.ts";

export interface IIdentityDto {
  entityIcType: Nullable<number>;
  entityIc: Nullable<string>;
}

export interface IIdentityModel {
  entity_ic_details: {
    ic_type: Nullable<number>;
    ic_no: Nullable<string>;
  };
}
