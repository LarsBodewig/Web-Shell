import {
  Action,
  AnyAction,
  Dispatch,
  PreloadedState,
  Reducer,
  StoreEnhancerStoreCreator,
} from "@reduxjs/toolkit";
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

    const dispatch: Dispatch<A> = <T extends A>(action: T) => {
      store.setEffect(ENHANCER_ID, undefined);
      return store.dispatch(action);
    };

    const dispatchWithEffect: DispatchWithEffect = (
      action: AnyAction,
      effect: () => void
    ) => {
      const result = store.dispatch(action as A);
      store.setEffect(ENHANCER_ID, effect);
      return result;
    };

    return {
      ...store,
      dispatch,
      dispatchWithEffect,
    };
  };
