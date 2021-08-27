import {
  Action,
  AnyAction,
  Dispatch,
  PreloadedState,
  Reducer,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
  Unsubscribe,
} from "@reduxjs/toolkit";

interface DispatchWithEffect<A extends Action = AnyAction> extends Dispatch<A> {
  <T extends A>(action: T, effect?: () => void): T;
}

interface WithEffect<A extends Action = AnyAction> {
  dispatchWithEffect: DispatchWithEffect<A>;
  subscribeWithEffect(listener: (callback: () => void) => void): Unsubscribe;
}

export const sideEffectEnhancer: StoreEnhancer<WithEffect> =
  (
    createStore: StoreEnhancerStoreCreator
  ): StoreEnhancerStoreCreator<WithEffect> =>
  <S, A extends Action = AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>
  ) => {
    const store = createStore(reducer, preloadedState);
    let effects: { [action: string]: () => void } = {};

    const dispatchWithEffect: DispatchWithEffect<A> = (
      action: A,
      effect?: () => void
    ) => {
      const result = store.dispatch(action);
      if (effect) {
        effects[action.type] = effect;
      }
      return result;
    };
    const subscribeWithEffect = (listener: (callback: () => void) => void) =>
      store.subscribe(() => {
        const callback = () =>
          Object.values(effects).forEach((effect) => effect());
        listener(callback);
        effects = {};
      });

    return {
      ...store,
      dispatchWithEffect,
      subscribeWithEffect,
    };
  };
