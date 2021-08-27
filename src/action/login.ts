import { addReducer } from "../redux/store";

export const TO_LOGIN = addReducer("to_login", (state) => {
  state.location.hash = "login";
});
