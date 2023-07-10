import { EntityType, IcType } from "../dbEnums.ts";
import {
  createEntityDto,
  entityDtoFromPayload,
  entityDtoFromModel,
  createEntityModel,
} from "./EntityDto.ts";
import { IEntityDto, IEntityModel } from "./interfaces/Entity.ts";
import {
  fnDtoCreate,
  fnDtoFromPayload,
  fnDtoFromModel,
} from "./interfaces/fn.ts";

export const enforceCompanyDto = (dto: IEntityDto) => {
  dto.entityType = EntityType.COMPANY;
  dto.entityIcType = IcType.COMPANY_REGNO;
  return dto;
};

export const createCompanyDto: fnDtoCreate<IEntityDto> = () =>
  enforceCompanyDto(createEntityDto());

export const createCompanyModel = createEntityModel;

export const companyDtoFromPayload: fnDtoFromPayload<IEntityDto> = (payload) =>
  enforceCompanyDto(entityDtoFromPayload(payload));

export const companyDtoFromModel: fnDtoFromModel<IEntityDto, IEntityModel> = (
  model
) => enforceCompanyDto(entityDtoFromModel(model));
