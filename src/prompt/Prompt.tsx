import { FormEvent, KeyboardEvent } from "react";
import { ARROW_DOWN } from "../action/arrowDown";
import { ARROW_UP } from "../action/arrowUp";
import { INPUT } from "../action/input";
import { TYPE } from "../action/type";
import { State } from "../redux/state";
import { store } from "../redux/store";
import { valueToUndefined } from "../util/filter";
import { KeyCode } from "../util/onKey";
import { calcInputHeight, isHeightMore } from "./inputHeight";
import "./Prompt.css";

export default function Prompt({
  state,
  history,
}: {
  state: State;
  history: boolean;
}) {
  const user = (
    <span className="prompt-user">
      {state.user.name}@{state.user.host}
    </span>
  );
  const env = <span className="prompt-env">WebShell</span>;
  const pathName = state.location.pathname ?? "/";
  const path = <span className="prompt-path">{pathName}</span>;
  const readOnly = valueToUndefined(history, false); // false does not work
  console.log(history + " " + readOnly);
  const input = (
    <textarea
      className="prompt-input"
      readOnly={readOnly}
      value={state.prompt.input}
      onInput={onInput}
      onKeyDown={mapKeys}
    ></textarea>
  );
  const result = state.prompt.result ? (
    <p className="prompt-result">{state.prompt.result}</p>
  ) : undefined;
  return (
    <div className="prompt">
      <p className="prompt-first-line">
        {user} {env} {path}
      </p>
      <p className="prompt-second-line">
        <span className="prompt-char">$</span>
        {input}
      </p>
      {result}
    </div>
  );
}

function onInput(event: FormEvent<HTMLTextAreaElement>) {
  const textarea = event.currentTarget;
  store.dispatch(TYPE(textarea.value));
  if (isHeightMore(textarea.scrollHeight)) {
    textarea.style.height = calcInputHeight(textarea.scrollHeight);
  } else {
    textarea.style.height = "1rem";
    if (textarea.scrollHeight >= textarea.clientHeight) {
      textarea.style.height = calcInputHeight(textarea.scrollHeight);
    }
  }
}

function mapKeys(event: KeyboardEvent<HTMLTextAreaElement>) {
  const textarea = event.currentTarget;
  switch (event.keyCode) {
    case KeyCode.Return:
      event.preventDefault();
      textarea.readOnly = true;
      store.dispatch(INPUT(textarea.value));
      break;
    case KeyCode.ArrowUp:
      store.dispatch(ARROW_UP());
      break;
    case KeyCode.ArrowDown:
      store.dispatch(ARROW_DOWN());
      break;
  }
}