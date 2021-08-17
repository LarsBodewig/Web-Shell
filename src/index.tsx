import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import { store } from "./redux/store";

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

store.subscribe(render);
render();
