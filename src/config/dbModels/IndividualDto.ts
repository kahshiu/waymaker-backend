import { EntityType, IcType } from "./enums.ts";
import {
  createEntityDto,
  createEntityModel,
  entityDtoFromPayload,
  entityDtoFromModel,
} from "./EntityDto.ts";
import { IEntityDto, IEntityModel } from "./interfaces/Entity.ts";
import {
  fnDtoCreate,
  fnDtoFromPayload,
  fnDtoFromModel,
} from "./interfaces/fn.ts";

const enforceIndividualDto = (dto: IEntityDto) => {
  dto.entityType = EntityType.INDIVIDUAL;
  dto.entityIcType = IcType.IC;
  return dto;
};

export const createIndividualDto: fnDtoCreate<IEntityDto> = () =>
  enforceIndividualDto(createEntityDto());

export const createIndividualModel = createEntityModel;

export const individualDtoFromPayload: fnDtoFromPayload<IEntityDto> = (
  payload
) => enforceIndividualDto(entityDtoFromPayload(payload));

export const individualDtoFromModel: fnDtoFromModel<
  IEntityDto,
  IEntityModel
> = (model) => enforceIndividualDto(entityDtoFromModel(model));
