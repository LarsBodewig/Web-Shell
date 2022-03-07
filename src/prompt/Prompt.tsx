import React, { FormEvent, Fragment, KeyboardEvent } from "react";
import { ARROW_DOWN } from "../action/arrowDown";
import { ARROW_UP } from "../action/arrowUp";
import { LOCK_STATE } from "../action/lockState";
import { PRINT } from "../action/print";
import { PUSH_STATE } from "../action/pushState";
import { TYPE } from "../action/type";
import { parse, run } from "../os/parser";
import { State } from "../redux/state";
import { store } from "../redux/store";
import { focusShellInput, scrollShellInputIntoView } from "../shell/Shell";
import { valueToUndefined } from "../util/filter";
import { KeyCode } from "../util/onKey";
import { calcInputHeight, isHeightMore } from "./inputHeight";
import "./Prompt.css";

export default function Prompt({
  state,
  shellId,
}: {
  state: State;
  shellId: string;
}) {
  const user = (
    <span className="prompt-user">
      {state.user.name}@{state.user.host}
    </span>
  );
  const env = <span className="prompt-env">WebShell</span>;
  const pathName = state.location.pathname ?? "/";
  const path = <span className="prompt-path">{pathName}</span>;
  const readOnly = valueToUndefined(state.locked, false); // false does not work
  const inputId = state.locked ? undefined : shellId;
  const input = (
    <textarea
      id={inputId}
      className="prompt-input"
      readOnly={readOnly}
      value={state.prompt.input}
      onInput={onInput}
      onKeyDown={mapKeys}
    ></textarea>
  );
  let result = undefined;
  if (state.prompt.result.length) {
    const resultLines = state.prompt.result.map((value, index) => (
      <Fragment key={index}>
        {value}
        {index === state.prompt.result.length - 1 ? undefined : <br />}
      </Fragment>
    ));
    result = <p className="prompt-result">{resultLines}</p>;
  }
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
  store.dispatchWithEffect(TYPE(textarea.value), scrollShellInputIntoView);
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
      const input = textarea.textContent ?? "";
      process(input);
      break;
    case KeyCode.ArrowUp:
      store.dispatchWithEffect(ARROW_UP(), scrollShellInputIntoView);
      break;
    case KeyCode.ArrowDown:
      store.dispatchWithEffect(ARROW_DOWN(), scrollShellInputIntoView);
      break;
  }
}

async function process(cmd: string) {
  store.dispatch(LOCK_STATE());
  const command = parse(cmd);
  const output = await run(command);
  while (await output.canRead()) {
    store.dispatch(PRINT(output.read()));
  }
  store.dispatchWithEffect(PUSH_STATE(), focusShellInput);
}
