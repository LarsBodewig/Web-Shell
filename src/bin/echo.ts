import { Command } from "../os/command";
import { InputStreamVoid, newOutputStream, OutputStream } from "../os/stream";

type Args = {
  value: string;
};

export class Echo extends Command<any, Args, string> {
  public process(_input: InputStreamVoid, args: Args): OutputStream<string> {
    const output = newOutputStream<string>();
    output.write(args.value);
    return output;
  }
}
