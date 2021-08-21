export function isEmptyObj(value: any): boolean {
  return value && Object.keys(value).length === 0;
}
