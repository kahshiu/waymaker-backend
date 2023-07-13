import { Nullable } from "./general.ts";

export interface ITokenDto {
  idToken: Nullable<string>;
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  expiresIn: Nullable<number>;
  tokenType: Nullable<string>;
  scope: string;
}

export interface ITokenEntity {
  id_token: Nullable<string>;
  access_token: Nullable<string>;
  refresh_token: Nullable<string>;
  expires_in: Nullable<number>;
  token_type: Nullable<string>;
  scope: string;
}
