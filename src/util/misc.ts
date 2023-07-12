export const isBlankObj = (obj: any) => {
  return Object.keys(obj).length > 0;
};

export const isBlankArray = (arr: any) => {
  return arr.length > 0;
};

export const isNil = (v: any) => v === null || v === undefined;

export const intersection = (arr1: any[], arr2: any[]) => {
  let isOverlap = false;
  for (let i = 0; i < arr1.length; i++) {
    const item1 = arr1[i];
    isOverlap = arr2.includes(item1);
    if (isOverlap) return isOverlap;
  }
  return isOverlap;
};
