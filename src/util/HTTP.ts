import { Context } from "oak/mod.ts";
import { isBlankObj, isBlankArray, isNil } from "./misc.ts";
import { consoleError } from "./Console.ts";

// *****************************
// SECTION: payload section
// *****************************
type TStatus = "OK" | "BLANK" | "ERROR";

export const customBody = <TPayload>(
  payload: TPayload,
  forceStatus?: TStatus
) => {
  const status = forceStatus ?? (isBlankObj(payload) ? "OK" : "BLANK");
  return { status, payload };
};

export const customBodyArr = <TPayload>(
  payload: TPayload,
  forceStatus?: TStatus
) => {
  const status = forceStatus ?? (isBlankArray(payload) ? "OK" : "BLANK");
  return { status, payload };
};

// *****************************
// SECTION: response section
// *****************************
interface IParams {
  statusCode?: number;
  contentType?: string;
  location?: string;
  body: any;
}

const resp = (context: Context, params: IParams) => {
  const statusCode = params.statusCode ?? 200;
  const contentType = params.contentType ?? "application/json";
  const body = params.body ?? {};
  const location = params.location ?? "";

  context.response.type = contentType;
  context.response.status = statusCode;
  context.response.body = params.statusCode === 204 ? null : body;
  if (statusCode >= 300 && statusCode < 400 && location.length > 0) {
    context.response.headers.set("location", location);
  }
};

// *****************************
// status code: 200
// *****************************
export const apiOk = (context: Context, params: IParams) => {
  const statusCode = 200;
  return resp(context, { ...params, statusCode });
};

export const apiNoContent = (context: Context, params: IParams) => {
  const statusCode = 204;
  return resp(context, { ...params, statusCode });
};

export const apiDetectContent = (context: Context, params: IParams) => {
  const payload = params.body?.payload;
  const hasContent =
    !isNil(payload) &&
    ((Array.isArray(payload) && isBlankArray(payload)) || isBlankObj(payload));

  if (hasContent) {
    return apiOk(context, params);
  }
  return apiNoContent(context, params);
};

// *****************************
// status code: 300
// *****************************
export const apiRedirect = (context: Context, params: IParams) => {
  consoleError("Redirect request: ", context.request.url);
  const statusCode = 302;
  return resp(context, { ...params, statusCode });
};

// *****************************
// status code: 400
// *****************************
export const apiBad = (context: Context, params: IParams) => {
  consoleError("Bad request: ", context.request.url);
  const statusCode = 400;
  return resp(context, { ...params, statusCode });
};

export const apiUnauth = (context: Context, params: IParams) => {
  consoleError("Unauthenticated request: ", context.request.url);
  const statusCode = 401;
  return resp(context, { ...params, statusCode });
};

// NOTE: insufficient permission
export const apiForbidden = (context: Context, params: IParams) => {
  consoleError("Forbidden request: ", context.request.url);
  const statusCode = 403;
  return resp(context, { ...params, statusCode });
};

export const apiNotFound = (context: Context, params: IParams) => {
  consoleError("Forbidden request: ", context.request.url);
  const statusCode = 404;
  return resp(context, { ...params, statusCode });
};

// *****************************
// status code: 500
// *****************************
export const apiInternalError = (context: Context, params: IParams) => {
  consoleError("Internal error request: ", context.request.url);
  const statusCode = 500;
  params.body.status = "ERROR";
  return resp(context, { ...params, statusCode });
};

export const apiNotImplemented = (context: Context, params: IParams) => {
  consoleError("Not implemented request: ", context.request.url);
  const statusCode = 501;
  return resp(context, { ...params, statusCode });
};
