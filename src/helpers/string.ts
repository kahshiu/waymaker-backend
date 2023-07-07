export const routeChaining = (prefix: string) => (route: string) => {
  return `${prefix}${route}`;
};
