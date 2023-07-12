import { Nullable } from "./general.ts";

export interface IContactDto {
  mobileNo: Nullable<string>;
  officeNo: Nullable<string>;
  email: Nullable<string>;
}

export interface IContactModel {
  contact_details: {
    mobile_no: Nullable<string>;
    office_no: Nullable<string>;
    email: Nullable<string>;
  };
}
