import { HELLO_SHOWN } from "../action/helloShown";
import { TO_LOGIN } from "../action/login";
import { store } from "../redux/store";
import "./App.css";

export default function App() {
  const state = store.getState();
  return (
    <div>
      <p onClick={hello}>{state.text}</p>
      <p style={{ height: "100vh" }} onClick={login}>
        login
      </p>
      <p id="login">logged in</p>
    </div>
  );
}

function hello() {
  store.dispatchWithEffect(HELLO_SHOWN("no hello"), () => {
    console.log("effect");
  });
}

function login() {
  store.dispatch(TO_LOGIN());
}