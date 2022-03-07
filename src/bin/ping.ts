import { Command } from "../os/command";
import { sleep } from "../os/processor";
import { InputStreamVoid, OutputStream } from "../os/stream";

export class Ping extends Command<string, {}, string> {
  constructor() {
    super("ping");
  }

  protected parseArgs(_args?: string): {} {
    return {};
  }

  protected async process(
    _input: InputStreamVoid,
    _args: {},
    output: OutputStream<string>
  ): Promise<OutputStream<string>> {
    const n = 10;
    const delay_ms = 1000;

    output.write("Ping is running...");
    let i = 0;
    for (; i < n; i++) {
      output.write("PING: Error: Unimplemented");
      await sleep(delay_ms);
    }
    output.write("Ping statistics: Sent = " + i);
    return Promise.resolve(output);
  }
}
