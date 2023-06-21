export const HTTPPayload = <TData>(data: TData) => {
    const status = data && Object.keys(data).length > 0 ? "OK": "BLANK";
    return {
        status,
        data,
    }
}
export const HTTPPayloadArray = <TData>(data: TData[]) => {
    const status = data.length > 0 ? "OK": "BLANK";
    return {
        status,
        data,
    }
}