import { addReducer } from "../redux/store";

export const PRINT = addReducer<string>((state, action) => {
  const result = action.payload;
  state.prompt.result = (state.prompt.result ?? "") + result;
});
