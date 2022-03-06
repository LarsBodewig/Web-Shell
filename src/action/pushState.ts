import { addReducer } from "../redux/store";
import clone from "just-clone";

export const PUSH_STATE = addReducer((state, _action) => {
  state.prevState = clone(state);
  state.id = state.id + 1;
  state.prompt.input = "";
  state.prompt.result = undefined;
});
