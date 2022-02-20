import { KeyboardEvent, KeyboardEventHandler } from "react";

// currently unused
export function onKey<T>(
  keyCode: KeyCode,
  handler: KeyboardEventHandler<T>
): KeyboardEventHandler<T> {
  const interceptor = (event: KeyboardEvent<T>) => {
    if (event.keyCode === keyCode) {
      handler(event);
    }
  };
  return interceptor;
}

export enum KeyCode {
  Return = 13,
  ArrowUp = 38,
  ArrowDown = 40,
}
