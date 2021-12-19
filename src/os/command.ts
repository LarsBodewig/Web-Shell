import { InputStream, OutputStream } from "./stream";

export type StreamFunction<I = void, O = void> = (a: I) => O;

export abstract class Command<I, A extends Arguments, O> {
  public call(args: A): StreamFunction<InputStream<I>, OutputStream<O>> {
    return (input: InputStream<I>) => {
      const output = this.process(input, args);
      output.close();
      return output;
    };
  }

  protected abstract process(input: InputStream<I>, args: A): OutputStream<O>;
}

export type Arguments = {
  [n: string]: any;
};
