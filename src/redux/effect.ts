import {
  Action,
  AnyAction,
  compose,
  PreloadedState,
  Reducer,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
  Unsubscribe,
} from "@reduxjs/toolkit";
import { runAll } from "../util/runAll";

export interface SubscribeWithEffect {
  subscribeWithEffect(listener: (callback: () => void) => void): Unsubscribe;
  setEffect(enhancer: string, effect: (() => void) | undefined): void;
}

export const subscribeWithEffectEnhancer: StoreEnhancer<SubscribeWithEffect> =
  (
    createStore: StoreEnhancerStoreCreator
  ): StoreEnhancerStoreCreator<SubscribeWithEffect> =>
  <S, A extends Action = AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>
  ) => {
    const store = createStore(reducer, preloadedState);
    let effects: { [enhancer: string]: () => void } = {};

    function subscribeWithEffect(listener: (callback: () => void) => void) {
      return store.subscribe(() =>
        listener(() => runAll(Object.values(effects)))
      );
    }

    function setEffect(enhancer: string, effect: (() => void) | undefined) {
      if (effect) {
        effects[enhancer] = effect;
      } else {
        delete effects[enhancer];
      }
    }

    return {
      ...store,
      subscribeWithEffect,
      setEffect,
    };
  };

export type DependentStoreEnhancer<
  Dep = {},
  DepState = {},
  Ext = {},
  StateExt = {}
> = (
  next: StoreEnhancerStoreCreator<Dep, DepState>
) => StoreEnhancerStoreCreator<Dep & Ext, DepState & StateExt>;

export function composeEffectEnhancers<A, AS, B, BS>(
  base: StoreEnhancer<SubscribeWithEffect>,
  a: DependentStoreEnhancer<SubscribeWithEffect, {}, A, AS>,
  b: DependentStoreEnhancer<SubscribeWithEffect, {}, B, BS>
): StoreEnhancer<SubscribeWithEffect & A & B, {} & AS & BS> {
  const f = [base, a, b];
  return compose(...f.reverse());
}
