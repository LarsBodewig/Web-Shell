import { reduce } from "../redux/store";

export const HELLO_SHOWN = reduce<string>("hello_shown", (state, action) => {
  state.text = action.payload;
  return state;
});
