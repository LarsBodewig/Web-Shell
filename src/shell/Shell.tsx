import Prompt from "../prompt/Prompt";
import { State } from "../redux/state";
import { store } from "../redux/store";
import "./Shell.css";

export default function Shell() {
  const state = store.getState();
  const prompt = renderPrompt(state);
  return <div className="shell fullsize">{prompt}</div>;
}

function renderPrompt(state: State, recursion = false): JSX.Element[] {
  let history = [];
  if (state.prevState) {
    history.push(...renderPrompt(state.prevState, true));
  }
  history.push(
    <Prompt
      state={state}
      history={recursion}
      shellId={SHELL_ID}
      key={state.id}
    />
  );
  return history;
}

const SHELL_ID: string = "shell-input";

function getShellInput(): HTMLElement | undefined {
  const shellInput = document.getElementById(SHELL_ID);
  return shellInput || undefined;
}

export function focusShellInput() {
  getShellInput()?.focus();
}

export function scrollShellInputIntoView() {
  getShellInput()?.scrollIntoView();
}
