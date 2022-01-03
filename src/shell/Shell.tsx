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
  history.push(<Prompt state={state} history={recursion} key={state.id} />);
  return history;
}
