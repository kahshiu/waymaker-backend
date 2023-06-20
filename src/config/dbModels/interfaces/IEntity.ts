import { IAddressDetails } from "./IAddressDetails.ts";
import { IContactDetails } from "./IContactDetails.ts";

export interface IEntity {
  entity_id: number;
  entity_name: string; 
  contact_details: IContactDetails;
  address_details: IAddressDetails;
  address_postcode: string;
  address_city: number | null;
  address_state: number | null;
}