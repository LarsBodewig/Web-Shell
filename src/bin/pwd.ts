import { Command } from "../os/command";
import { InputStreamVoid, OutputStream } from "../os/stream";
import { locToUrl } from "../redux/location";
import { store } from "../redux/store";

export class Pwd extends Command<void, {}, string> {
  constructor() {
    super("pwd");
  }

  protected parseArgs(_args?: string): {} {
    return {};
  }

  protected process(
    _input: InputStreamVoid,
    _args: {},
    output: OutputStream<string>
  ): Promise<OutputStream<string>> {
    const state = store.getState();
    const path = locToUrl(state.location);
    output.write(path || "/");
    return Promise.resolve(output);
  }
}
