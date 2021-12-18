import { StreamFunction } from "./command";
import {
  InputStream,
  InputStreamVoid,
  newInputStreamVoid,
  OutputStream,
} from "./stream";

export class Interpreter {
  static async toString(
    func: StreamFunction<InputStreamVoid, OutputStream<string>>,
    separator?: string
  ): Promise<string> {
    const input = newInputStreamVoid();
    const output = func(input).asInputStream();
    const result = [];
    while (output.canRead()) {
      const value = await output.read();
      result.push(value);
    }
    return Promise.resolve(result.join(separator));
  }
}

export function pipe<I, T, O>(
  funcA: StreamFunction<InputStream<I>, OutputStream<T>>,
  funcB: StreamFunction<InputStream<T>, OutputStream<O>>
): StreamFunction<InputStream<I>, OutputStream<O>> {
  return (input: InputStream<I>) => {
    const transfer = funcA(input).asInputStream();
    const output = funcB(transfer);
    return output;
  };
}
