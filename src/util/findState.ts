import { State } from "../redux/state";
import { store } from "../redux/store";

export function findStateById(
  id: number,
  state = store.getState()
): State | undefined {
  let currentState = state;
  while (currentState) {
    if (currentState.id === id) {
      return currentState;
    }
    currentState = currentState.prevState;
  }
  return undefined;
}

export function findDeepestState(state = store.getState()): State {
  let currentState = state;
  while (currentState.prevState) {
    currentState = currentState.prevState;
  }
  return currentState;
}

export function findNextState(
  prevState: State,
  state = store.getState()
): State | undefined {
  let nextState = undefined;
  let currentState = state;
  while (currentState.id !== prevState.id) {
    nextState = currentState;
    currentState = currentState.prevState;
  }
  return nextState;
}
