import { addReducer } from "../redux/store";

export const PRINT = addReducer<string>((state, action) => {
  const value = action.payload;
  state.prompt.result.push(value);
});
