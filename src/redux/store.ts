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
import { navigationMiddleware } from "./navigation";
import { initialState, State } from "./state";

export type Store = typeof store;
export type Reducer<Payload = void> = (
  state: State,
  action: PayloadAction<Payload, string>
) => State | void;

const reducerBuilder: CaseReducers<State, any> = {};
export function addReducer<Payload = void>(
  name: string,
  reducer: Reducer<Payload>
): PayloadActionCreator<Payload, string> {
  const action = createAction<Payload>(name);
  reducerBuilder[name] = reducer;
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
  composeEnhancers(applyMiddleware(navigationMiddleware))
);
