import { addReducer } from "../redux/store";

export const TYPE = addReducer<string>((state, action) => {
  const input = action.payload;
  state.prompt.input = input;
});
