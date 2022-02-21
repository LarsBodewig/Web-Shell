import { addReducer } from "../redux/store";

export const INPUT = addReducer((state, _action) => {
  state.locked = true;
});
