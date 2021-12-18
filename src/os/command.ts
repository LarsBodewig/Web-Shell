import { InputStream, OutputStream } from "./stream";

export abstract class Command<I, A extends Arguments, O> {
  public in: InputStream<I>;
  public out: OutputStream<O>;

  constructor(input = InputStream.void, output = OutputStream.void) {
    this.in = input;
    this.out = output;
  }

  public async execute(args: A) {
    const input = await this.in.read();
    const output = this.call(input, args);
    this.out.write(output);
  }

  public abstract call(input: I, args: A): O;
}

export type Arguments = {
  [n: string]: any;
};

// export class Value {}
