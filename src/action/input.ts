import clone from "just-clone";
import { addReducer } from "../redux/store";

export const INPUT = addReducer<string>((state, action) => {
  const input = action.payload;
  state.prevState = clone(state);
  state.prevState.prompt.result = "input was: " + input; // await parse(input);
  state.id = state.id + 1;
  state.prompt.input = "";
});
