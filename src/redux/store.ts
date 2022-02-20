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
} from "@reduxjs/toolkit";
import { CaseReducers } from "@reduxjs/toolkit/dist/createReducer";
import { Dispatch } from "react";
import { actionEffectEnhancer } from "./actionEffect";
import { composeEffectEnhancers, subscribeWithEffectEnhancer } from "./effect";
import { navigationEffectEnhancer, navigationMiddleware } from "./navigation";
import { initialState, State } from "./state";
import { produce } from "immer";

export type Store = typeof store;
export type Reducer<Payload = void> = (
  state: State,
  action: PayloadAction<Payload, string>
) => State | void;

let nextFreeId = 0;
function nextId(): string {
  const id = nextFreeId;
  nextFreeId++;
  return id.toString();
}

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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  createReducer(initialState, reducerBuilder),
  composeEnhancers(
    composeEffectEnhancers(
      subscribeWithEffectEnhancer,
      actionEffectEnhancer,
      navigationEffectEnhancer
    ),
    applyMiddleware(navigationMiddleware)
  )
);
