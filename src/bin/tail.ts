import { Command } from "../os/command";
import { InputStream, OutputStream } from "../os/stream";

export class Tail extends Command<string, {}, string> {
  constructor() {
    super("tail");
  }

  protected parseArgs(_args?: string): {} {
    return {};
  }

  protected async process(
    input: InputStream<string>,
    _args: {},
    output: OutputStream<string>
  ): Promise<OutputStream<string>> {
    const n = 10;
    const buffer = [];
    while (await input.canRead()) {
      buffer.push(input.read());
      if (buffer.length > n) {
        buffer.shift();
      }
    }
    buffer.forEach((value) => output.write(value));
    return Promise.resolve(output);
  }
}
