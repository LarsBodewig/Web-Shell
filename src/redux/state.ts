import { initialLocation } from "./location";

export const initialState = {
  location: initialLocation,
  text: "Hello World!",
};

export type State = typeof initialState;
