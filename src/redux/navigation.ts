import {
  Action,
  AnyAction,
  PreloadedState,
  StoreEnhancerStoreCreator,
  Reducer,
} from "@reduxjs/toolkit";
import clone from "just-clone";
import { DependentStoreEnhancer, SubscribeWithEffect } from "./effect";
import { locEquals, initialLocation, locToUrl } from "./location";
import { createMiddleware } from "./store";

let previousLocation = clone(initialLocation);
let newHash: string | undefined = undefined;

export const navigationMiddleware = createMiddleware((state) => {
  const { location } = state;
  if (!locEquals(previousLocation, location)) {
    const url = locToUrl(location);
    newHash =
      location.hash && location.hash !== previousLocation.hash
        ? location.hash
        : undefined;
    window.history.pushState(undefined, "", url);
    previousLocation = clone(location);
  }
});

export const navigationEffectEnhancer: DependentStoreEnhancer<
  SubscribeWithEffect
> =
  (
    createStore: StoreEnhancerStoreCreator<SubscribeWithEffect>
  ): StoreEnhancerStoreCreator<SubscribeWithEffect> =>
  <S, A extends Action = AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>
  ) => {
    const store = createStore(reducer, preloadedState);
    store.setEffect("navigation", () => {
      scrollToAnchor(newHash);
    });
    return store;
  };

export function scrollToAnchor(hash?: string): void {
  hash = hash ?? window.location.hash;
  if (hash) {
    const anchor = document.getElementById(hash);
    if (anchor) {
      anchor.scrollIntoView();
      anchor.focus();
      newHash = undefined;
    }
  }
}
