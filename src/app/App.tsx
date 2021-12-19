import { Echo } from "../bin/echo";
import { store } from "../redux/store";
import { Interpreter } from "../os/interpreter";
import Shell from "../shell/Shell";
import "./App.css";

export default function App() {
  const state = store.getState();
  return (
    <div className="app">
      <p onClick={echo}>{state.text}</p>
      <Shell />
    </div>
  );
}

async function echo() {
  const test = await Interpreter.toString(
    new Echo().call({ value: "test" }),
    "<br>"
  );
  console.log(test);
  // store.dispatch(HELLO_SHOWN(test));
}
