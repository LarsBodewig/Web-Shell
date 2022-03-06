import { addReducer } from "../redux/store";

export const LOCK_STATE = addReducer((state, _action) => {
  state.locked = true;
});
