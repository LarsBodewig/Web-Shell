import { compose } from "@reduxjs/toolkit";
import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import "./index.css";
import { store } from "./redux/store";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

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
