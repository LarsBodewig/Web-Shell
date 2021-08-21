import { initialLocation } from "./location";
import { createMiddleware } from "./store";

let previousLocation = initialLocation.clone();

export const navigationMiddleware = createMiddleware((state, action) => {
  const { location } = state;
  if (!previousLocation.equals(location)) {
    const url = location.toUrl();
    window.history.pushState(undefined, "", url);
    previousLocation = location.clone();
  }
});
