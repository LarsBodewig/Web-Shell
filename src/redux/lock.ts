import {
  Action,
  AnyAction,
  PreloadedState,
  Reducer,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
} from "@reduxjs/toolkit";

interface Lock {
  isLocked(): boolean;
  lockState(): void;
  unlockState(): void;
}

export const lockEnhancer: StoreEnhancer<Lock> =
  (createStore: StoreEnhancerStoreCreator): StoreEnhancerStoreCreator<Lock> =>
  <S, A extends Action = AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>
  ) => {
    const store = createStore(reducer, preloadedState);
    let locked = false;

    function isLocked() {
      return locked;
    }

    function lockState() {
      locked = true;
    }

    function unlockState() {
      locked = false;
    }

    function dispatch<T extends A>(action: T) {
      if (!locked) store.dispatch(action);
      return action;
    }

    return {
      ...store,
      dispatch,
      isLocked,
      lockState,
      unlockState,
    };
  };
