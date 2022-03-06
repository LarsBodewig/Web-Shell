import {
  Action,
  AnyAction,
  PreloadedState,
  Reducer,
  StoreEnhancerStoreCreator,
} from "@reduxjs/toolkit";
import { runAll } from "../util/runAll";
import { DependentStoreEnhancer, SubscribeWithEffect } from "./effect";

interface ActionWithEffect {
  dispatchWithEffect: DispatchWithEffect;
}

interface DispatchWithEffect {
  (action: AnyAction, effect: () => void): AnyAction;
}

export const actionEffectEnhancer: DependentStoreEnhancer<
  SubscribeWithEffect,
  {},
  ActionWithEffect
> =
  (
    createStore: StoreEnhancerStoreCreator<SubscribeWithEffect>
  ): StoreEnhancerStoreCreator<SubscribeWithEffect & ActionWithEffect> =>
  <S, A extends Action = AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>
  ) => {
    const store = createStore(reducer, preloadedState);
    const ENHANCER_ID = "action";

    let actionEffects: { [action: string]: () => void } = {};

    function dispatchWithEffect(action: AnyAction, effect: () => void) {
      actionEffects[action.type] = effect;
      store.setEffect(ENHANCER_ID, () => {
        runAll(Object.values(actionEffects));
        actionEffects = {};
      });
      return store.dispatch(action as A);
    }

    return {
      ...store,
      dispatchWithEffect,
    };
  };
