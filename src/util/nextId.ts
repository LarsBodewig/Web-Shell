let nextFreeId = 0;

export function nextId(): string {
  const id = nextFreeId;
  nextFreeId++;
  return id.toString();
}
