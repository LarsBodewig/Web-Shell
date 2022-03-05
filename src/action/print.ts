import { addReducer } from "../redux/store";

export const PRINT = addReducer<string>((state, action) => {
  const value = action.payload;
  if (state.prompt.result === undefined) {
    state.prompt.result = value;
  } else {
    state.prompt.result = state.prompt.result + "<br>" + value;
  }
});
