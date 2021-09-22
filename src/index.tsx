import { compose } from "@reduxjs/toolkit";
import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import "./index.css";
import { scrollToAnchor } from "./redux/navigation";
import { store } from "./redux/store";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

function render(callback?: () => void) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root"),
    callback
  );
}

store.subscribeWithEffect(render);
render(scrollToAnchor);
