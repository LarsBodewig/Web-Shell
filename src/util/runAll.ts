export function runAll(functions: (() => void)[]): void {
  return functions.forEach((f) => f());
}
