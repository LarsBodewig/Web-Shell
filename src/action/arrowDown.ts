import { addReducer } from "../redux/store";
import {
  findDeepestState,
  findNextState,
  findStateById,
} from "../util/findState";

export const ARROW_DOWN = addReducer((state) => {
  let nextState;
  if (state.prompt.currentId !== undefined) {
    const currentState = findStateById(state.prompt.currentId, state);
    if (currentState) {
      nextState = findNextState(currentState, state);
    }
  } else {
    nextState = findDeepestState(state);
  }
  if (nextState && nextState.id !== state.id) {
    state.prompt.currentId = nextState.id;
    state.prompt.input = nextState.prompt.input;
  } else {
    state.prompt.currentId = undefined;
    state.prompt.input = "";
  }
});
