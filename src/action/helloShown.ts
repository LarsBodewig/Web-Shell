import { addReducer } from "../redux/store";

export const HELLO_SHOWN = addReducer<string>(
  "hello_shown",
  (state, action) => {
    state.text = action.payload;
    return state;
  }
);
