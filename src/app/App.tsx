import { HELLO_SHOWN } from "../redux/helloShown";
import { store } from "../redux/store";
import "./App.css";

export default function App() {
  const state = store.getState();
  return (
    <div>
      <p onClick={doClick}>{state.text}</p>
    </div>
  );
}

function doClick() {
  store.dispatch(HELLO_SHOWN("No Hello"));
}
