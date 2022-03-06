import { Command } from "../os/command";
import { InputStreamVoid, OutputStream } from "../os/stream";

type Args = {
  value: string;
};

export class Echo extends Command<any, Args, string> {
  constructor() {
    super("echo");
  }

  protected parseArgs(args?: string): Args {
    return { value: args ?? "" };
  }

  protected process(
    _input: InputStreamVoid,
    args: Args,
    output: OutputStream<string>
  ): Promise<OutputStream<string>> {
    output.write(args.value);
    return Promise.resolve(output);
  }
}
