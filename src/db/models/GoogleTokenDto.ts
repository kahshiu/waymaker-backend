import { ITokenEntity, ITokenDto } from "./interfaces/GoogleToken.ts";

export const tokenDtoFromEntity = (payload: Partial<ITokenEntity>) => {
  return <ITokenDto>{
    idToken: payload?.id_token ?? null,
    accessToken: payload?.access_token ?? null,
    refreshToken: payload?.refresh_token ?? null,
    expiresIn: payload?.expires_in ?? null,
    tokenType: payload?.token_type ?? null,
    scope: payload?.scope ?? "",
  };
};

export const tokenDtoToEntity = (dto: Partial<ITokenDto>) => {
  return <ITokenEntity>{
    id_token: dto?.idToken ?? null,
    access_token: dto?.accessToken ?? null,
    refresh_token: dto?.refreshToken ?? null,
    expires_in: dto?.expiresIn ?? null,
    token_type: dto?.tokenType ?? null,
    scope: dto?.scope ?? null,
  };
};
