const CLOCK_SPEED_MS = 100;

export async function waitFor(condition: () => boolean): Promise<void> {
  while (!condition()) {
    await sleep(CLOCK_SPEED_MS);
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
