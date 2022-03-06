import {
  AnyAction,
  applyMiddleware,
  compose,
  createAction,
  createReducer,
  createStore,
  MiddlewareAPI,
  PayloadAction,
  PayloadActionCreator,
  StoreEnhancer,
} from "@reduxjs/toolkit";
import { CaseReducers } from "@reduxjs/toolkit/dist/createReducer";
import { Dispatch } from "react";
import { actionEffectEnhancer } from "./actionEffect";
import { composeEffectEnhancers, subscribeWithEffectEnhancer } from "./effect";
import { navigationEffectEnhancer, navigationMiddleware } from "./navigation";
import { initialState, State } from "./state";
import { produce } from "immer";
import { nextId } from "../util/nextId";
import { lockEnhancer } from "./lock";

export type Store = typeof store;
export type Reducer<Payload = void> = (
  state: State,
  action: PayloadAction<Payload, string>
) => State | void;

const reducerBuilder: CaseReducers<State, any> = {};
export function addReducer<Payload = void>(
  reducer: Reducer<Payload>
): PayloadActionCreator<Payload, string> {
  const name = nextId();
  const action = createAction<Payload>(name);
  const producer: Reducer<Payload> = (s, a) => produce(s, (d) => reducer(d, a));
  reducerBuilder[name] = producer;
  return action;
}

export function createMiddleware(
  middleware: (state: State, action: AnyAction) => any
) {
  return (store: MiddlewareAPI) =>
    (dispatch: Dispatch<AnyAction>) =>
    (action: AnyAction) => {
      dispatch(action);
      middleware(store.getState(), action);
    };
}

export const store = createStore(
  createReducer(initialState, reducerBuilder),
  composeEnhancers(
    composeEffectEnhancers(
      subscribeWithEffectEnhancer,
      actionEffectEnhancer,
      navigationEffectEnhancer
    ),
    lockEnhancer,
    applyMiddleware(navigationMiddleware)
  )
);

export function composeEnhancers<A, AS, B, BS, C, CS>(
  a: StoreEnhancer<A, AS>,
  b: StoreEnhancer<B, BS>,
  c: StoreEnhancer<C, CS>
): StoreEnhancer<{} & A & B & C, {} & AS & BS & CS> {
  const extensionEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__?.();
  const f = extensionEnhancer ? [extensionEnhancer, a, b, c] : [a, b, c];
  return compose(...f.reverse());
}
