import { InputStream, newOutputStream, OutputStream } from "./stream";

export type StreamFunction<I = void, O = void> = (a: I) => O;

export abstract class Command<I, A extends Arguments, O> {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public call(args?: string): StreamFunction<InputStream<I>, OutputStream<O>> {
    return (input: InputStream<I>) => {
      const parsedArgs = this.parseArgs(args);
      const output = newOutputStream<O>();
      const processed = this.process(input, parsedArgs, output);
      processed.finally(() => output.close());
      return output;
    };
  }

  protected abstract parseArgs(args?: string): A;

  protected abstract process(
    input: InputStream<I>,
    args: A,
    output: OutputStream<O>
  ): Promise<OutputStream<O>>;
}

export type Arguments = {
  [n: string]: any;
};
