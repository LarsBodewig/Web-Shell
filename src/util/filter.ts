export function valueToUndefined<T>(value: T, ...filter: T[]): T | undefined {
  return filter.includes(value) ? undefined : value;
}

export function filterToUndefined<T>(
  value: T,
  filter: (v: T) => boolean
): T | undefined {
  return filter(value) ? undefined : value;
}
