import { HELLO_SHOWN } from "../action/helloShown";
import { TO_LOGIN } from "../action/login";
import { store } from "../redux/store";
import "./App.css";

export default function App() {
  const state = store.getState();
  return (
    <div>
      <p onClick={hello}>{state.text}</p>
      <p onClick={login}>login</p>
    </div>
  );
}

function hello() {
  store.dispatch(HELLO_SHOWN("no hello"));
}

function login() {
  store.dispatch(TO_LOGIN());
}
