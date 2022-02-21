import { InputStream, OutputStream } from "./stream";

export type StreamFunction<I = void, O = void> = (a: I) => Promise<O>;

export abstract class Command<I, A extends Arguments, O> {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public call(args?: string): StreamFunction<InputStream<I>, OutputStream<O>> {
    return async (input: InputStream<I>) => {
      const parsedArgs = this.parseArgs(args);
      const outputPromise = this.process(input, parsedArgs);
      const output = await outputPromise;
      output.close();
      return output;
    };
  }

  protected abstract parseArgs(args?: string): A;

  protected abstract process(
    input: InputStream<I>,
    args: A
  ): Promise<OutputStream<O>>;
}

export type Arguments = {
  [n: string]: any;
};

export function pipe<I, T, O>(
  funcA: StreamFunction<InputStream<I>, OutputStream<T>>,
  funcB: StreamFunction<InputStream<T>, OutputStream<O>>
): StreamFunction<InputStream<I>, OutputStream<O>> {
  return async (input: InputStream<I>) => {
    const transfer = await funcA(input);
    const output = funcB(transfer.asInputStream());
    return output;
  };
}
