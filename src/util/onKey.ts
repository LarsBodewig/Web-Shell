import { KeyboardEvent, KeyboardEventHandler } from "react";

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
}
