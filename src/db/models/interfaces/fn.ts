export type fnDtoCreate<IDto> = () => IDto;
export type fnModelCreate<IModel> = () => IModel;
export type fnDtoFromPayload<IDto> = (payload: any) => IDto;
export type fnDtoFromModel<IDto, IModel> = (model: IModel) => IDto;
export type fnDtoToModel<IDto, IModel> = (dto: IDto) => IModel;
