// SECTION: default values
export const mapDefaults = (value: any, map: Map<any, any>) => {
  if (map.has(value)) return map.get(value);
  else return value;
};

export const dtoDefaultString = (value: any) => {
  return mapDefaults(
    value,
    new Map([
      [null, null],
      [undefined, null],
      ["", null],
    ])
  );
};

export const dtoDefaultNum = (value: any) => {
  return mapDefaults(
    value,
    new Map([
      [null, null],
      [undefined, null],
    ])
  );
};

export const dtoDefaultId = (value: any) => {
  return mapDefaults(
    value,
    new Map([
      [null, -1],
      [undefined, -1],
    ])
  );
};

export const extractNumbers = (value: any) => {
  if (value === null) return value;
  return value.replace(/[^0-9]/g, "");
};
