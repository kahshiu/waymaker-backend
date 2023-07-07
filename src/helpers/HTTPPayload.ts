type TStatus = "OK" | "BLANK" | "ERROR";

export const HTTPPayload = <TPayload>(
  payload: TPayload,
  overwriteStatus?: string
) => {
  const status = payload && Object.keys(payload).length > 0 ? "OK" : "BLANK";
  return { status: overwriteStatus ?? status, payload };
};

export const HTTPPayloadArray = <TPayload>(
  payload: TPayload[],
  overwriteStatus?: string
) => {
  const status = payload.length > 0 ? "OK" : "BLANK";
  return { status: overwriteStatus ?? status, payload };
};
