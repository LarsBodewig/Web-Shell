import { initialLocation } from "./location";

export const initialState = {
  id: 0,
  location: initialLocation,
  text: "Hello World!",
  user: {
    id: -1,
    name: "Anon",
    host: "localhost",
  },
  prompt: {
    input: "",
    result: undefined as string | undefined,
  },
  prevState: undefined as any,
};

export type State = typeof initialState;
