import { waitFor } from "./processor";

export abstract class Stream<T> {
  public buffer: T[];
  public closed: boolean;

  constructor() {
    this.buffer = [];
    this.closed = false;
  }

  public close(): void {
    this.closed = true;
  }
}

export class InputStream<T> extends Stream<T> {
  static void = new InputStream<any>();

  public read(): Promise<T> {
    let value = this.buffer.shift();
    if (value) return Promise.resolve(value);
    if (!this.closed) {
      waitFor(() => this.closed && this.buffer.length > 0);
      value = this.buffer.shift();
      if (value) return Promise.resolve(value);
    }
    return Promise.reject();
  }
}

export class OutputStream<T> extends Stream<T> {
  static void = new OutputStream<any>();

  public write(value: T): void {
    if (!this.closed) {
      this.buffer.push(value);
    }
  }
}
