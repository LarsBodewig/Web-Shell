import {
  Action,
  AnyAction,
  PreloadedState,
  Reducer,
  StoreEnhancerStoreCreator,
} from "@reduxjs/toolkit";
import { DependentStoreEnhancer, SubscribeWithEffect } from "./effect";
import { initialLocation } from "./location";
import { createMiddleware } from "./store";

let previousLocation = initialLocation.clone();
let newHash: string | undefined = undefined;

export const navigationMiddleware = createMiddleware((state, action) => {
  const { location } = state;
  if (!previousLocation.equals(location)) {
    const url = location.toUrl();
    newHash =
      location.hash && location.hash !== previousLocation.hash
        ? location.hash
        : undefined;
    window.history.pushState(undefined, "", url);
    previousLocation = location.clone();
  }
});

export const navigationEffectEnhancer: DependentStoreEnhancer<SubscribeWithEffect> =

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
