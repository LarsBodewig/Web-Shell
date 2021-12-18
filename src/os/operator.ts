import { Command } from "./command";
import { InputStream, Stream } from "./stream";

export function pipe<T>(from: Command<any, any, T>, to: Command<T, any, any>) {
  // does this work?
  to.in = from.out as Stream<T> as InputStream<T>;
}
