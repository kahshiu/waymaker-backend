import { Nullable } from "./general.ts";

export interface IAddressDto {
  address1: Nullable<string>;
  address2: Nullable<string>;
  address3: Nullable<string>;
  addressPostcode: Nullable<string>;
  addressCity: Nullable<string>;
  addressState: Nullable<number>;
}
export interface IAddressModel {
  address_details: {
    address1: Nullable<string>;
    address2: Nullable<string>;
    address3: Nullable<string>;
  };
  address_postcode: Nullable<string>;
  address_city: Nullable<string>;
  address_state: Nullable<number>;
}
