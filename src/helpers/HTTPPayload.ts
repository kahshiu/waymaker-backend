export const HTTPPayload = <TPayload>(payload: TPayload) => {
  const status = payload && Object.keys(payload).length > 0 ? "OK" : "BLANK";
  return { status, payload };
};
export const HTTPPayloadArray = <TPayload>(payload: TPayload[]) => {
  const status = payload.length > 0 ? "OK" : "BLANK";
  return { status, payload };
};
