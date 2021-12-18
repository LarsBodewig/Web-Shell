const CLOCK_SPEED_MS = 100;

export async function waitFor(condition: () => boolean) {
  while (!condition()) {
    window.setTimeout(() => {}, CLOCK_SPEED_MS);
  }
}
