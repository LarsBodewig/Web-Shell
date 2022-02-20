import { addReducer } from "../redux/store";
import { findStateById } from "../util/findState";

export const ARROW_UP = addReducer((state) => {
  let currentState;
  if (state.prompt.currentId !== undefined) {
    currentState = findStateById(state.prompt.currentId, state);
  } else {
    currentState = state;
  }
  if (currentState && currentState.prevState) {
    const prevState = currentState.prevState;
    state.prompt.currentId = prevState.id;
    state.prompt.input = prevState.prompt.input;
  } else {
    state.prompt.currentId = undefined;
    state.prompt.input = "";
  }
});
