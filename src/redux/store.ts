import {
  configureStore,
  createAction,
  createReducer,
  PayloadAction,
  PayloadActionCreator,
} from "@reduxjs/toolkit";
import { CaseReducers } from "@reduxjs/toolkit/dist/createReducer";
import { state as initialState, State } from "./state";

export type Store = typeof store;
export type Reducer<Payload = void> = (
  state: State,
  action: PayloadAction<Payload, string>
) => State;

const reducerBuilder: CaseReducers<State, any> = {};
export function reduce<Payload = void>(
  name: string,
  reducer: Reducer<Payload>
): PayloadActionCreator<Payload, string> {
  const action = createAction<Payload>(name);
  reducerBuilder[name] = reducer;
  return action;
}
export const store = configureStore({
  reducer: createReducer(initialState, reducerBuilder),
});
