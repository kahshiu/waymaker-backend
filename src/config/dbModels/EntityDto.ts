import {
  dtoDefaultId,
  dtoDefaultNum,
  dtoDefaultString,
} from "../util/defaults.ts";
import { IEntityDto, IEntityModel } from "./interfaces/Entity.ts";
import {
  fnDtoCreate,
  fnModelCreate,
  fnDtoFromPayload,
  fnDtoToModel,
  fnDtoFromModel,
} from "./interfaces/fn.ts";

export const createEntityDto: fnDtoCreate<IEntityDto> = () => {
  return {
    entityId: -1,
    entityType: null,
    entityName: "",
    entityIcType: null,
    entityIc: null,

    mobileNo: null,
    officeNo: null,
    email: null,

    // address
    address1: null,
    address2: null,
    address3: null,
    addressPostcode: null,
    addressCity: null,
    addressState: null,

    // additional
    note: null,
  };
};

export const createEntityModel: fnModelCreate<IEntityModel> = () => {
  return {
    entity_id: -1,
    entity_type: null,
    entity_name: "",
    entity_ic_details: {
      ic_type: null,
      ic_no: null,
    },
    contact_details: {
      mobile_no: null,
      office_no: null,
      email: null,
    },
    address_details: {
      address1: null,
      address2: null,
      address3: null,
    },
    address_postcode: null,
    address_city: null,
    address_state: null,
    note: null,
  };
};

// TODO:
// check what null in db turns into from db driver

// RULES:
// 1. database null-values will retain in dto
// 2. payload empty/ undefined values will be null
// 3. data integrity at dto level, payload to dto/ model to dto

export const entityDtoFromPayload: fnDtoFromPayload<IEntityDto> = (payload) => {
  const dto = createEntityDto();
  dto.entityId = dtoDefaultId(payload.entityId);
  dto.entityType = dtoDefaultNum(payload.entityType);
  dto.entityName = payload.entityName ?? "";
  dto.entityIcType = dtoDefaultNum(payload.entityIcType);
  dto.entityIc = dtoDefaultString(payload.entityIcType);

  dto.mobileNo = dtoDefaultString(payload.mobileNo);
  dto.officeNo = dtoDefaultString(payload.officeNo);
  dto.email = dtoDefaultString(payload.email);

  dto.address1 = dtoDefaultString(payload.address1);
  dto.address2 = dtoDefaultString(payload.address2);
  dto.address3 = dtoDefaultString(payload.address3);
  dto.addressPostcode = dtoDefaultString(payload.addressPostCode);
  dto.addressCity = dtoDefaultString(payload.addressCity);
  dto.addressState = dtoDefaultNum(payload.addressState);
  dto.note = dtoDefaultString(payload.note);

  return dto;
};

// NOTE: mainly to massage data shape + camelcase - snakecase of db
export const entityDtoToModel: fnDtoToModel<IEntityDto, IEntityModel> = (
  dto
) => {
  const model = createEntityModel();
  model.entity_id = dto.entityId;
  model.entity_type = dto.entityType;
  model.entity_name = dto.entityName;
  model.entity_ic_details.ic_type = dto.entityIcType;
  model.entity_ic_details.ic_no = dto.entityIc;

  model.contact_details.mobile_no = dto.mobileNo;
  model.contact_details.office_no = dto.officeNo;
  model.contact_details.email = dto.email;

  model.address_details.address1 = dto.address1;
  model.address_details.address2 = dto.address2;
  model.address_details.address3 = dto.address3;
  model.address_postcode = dto.addressPostcode;
  model.address_city = dto.addressCity;
  model.address_state = dto.addressState;

  model.note = dto.note;
  return model;
};

export const entityDtoFromModel: fnDtoFromModel<IEntityDto, IEntityModel> = (
  model
) => {
  const dto = createEntityDto();
  dto.entityId = model.entity_id;
  dto.entityType = model.entity_type;
  dto.entityName = model.entity_name;

  dto.mobileNo = dtoDefaultString(model.contact_details?.mobile_no);
  dto.officeNo = dtoDefaultString(model.contact_details?.office_no);
  dto.email = dtoDefaultString(model.contact_details?.email);

  dto.address1 = dtoDefaultString(model.address_details?.address1);
  dto.address2 = dtoDefaultString(model.address_details?.address2);
  dto.address3 = dtoDefaultString(model.address_details?.address3);
  dto.addressPostcode = model.address_postcode;
  dto.addressCity = model.address_city;
  dto.addressState = model.address_state;

  dto.note = model.note;
  return dto;
};
