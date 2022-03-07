import { waitFor } from "./processor";

interface Stream {
  isClosed(): boolean;
  close(): void;
}

export interface InputStream<T> extends Stream {
  read(): T;
  asOutputStream(): OutputStream<T>;
  canRead(): Promise<boolean>;
}

export interface OutputStream<T> extends Stream {
  write(value: T): void;
  asInputStream(): InputStream<T>;
}

class StreamImpl<T> implements InputStream<T>, OutputStream<T> {
  public buffer: T[];
  public closed: boolean;

  constructor() {
    this.buffer = [];
    this.closed = false;
  }

  public close(): void {
    this.closed = true;
  }

  public isClosed(): boolean {
    return this.closed;
  }

  public read(): T {
    let value = this.buffer.shift();
    if (value === undefined) throw new Error("Buffer is empty");
    return value;
  }

  public async canRead(): Promise<boolean> {
    return waitFor(() => this.closed || this.buffer.length > 0).then(
      () => this.buffer.length > 0
    );
  }

  public write(value: T): void {
    if (!this.closed) {
      this.buffer.push(value);
    }
  }

  public asInputStream(): InputStream<T> {
    return this as Stream as InputStream<T>;
  }

  public asOutputStream(): OutputStream<T> {
    return this as Stream as OutputStream<T>;
  }
}

export function newInputStream<T>(): InputStream<T> {
  return new StreamImpl<T>() as Stream as InputStream<T>;
}

export function newOutputStream<T>(): OutputStream<T> {
  return new StreamImpl<T>() as Stream as OutputStream<T>;
}

export interface InputStreamVoid extends InputStream<any> {}

export interface OutputStreamVoid extends OutputStream<never> {}

class VoidStreamImpl implements InputStreamVoid, OutputStreamVoid {
  public close(): void {}

  public isClosed(): boolean {
    return true;
  }

  public read(): never {
    throw new Error("Buffer is empty");
  }

  public canRead(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public write(_value: any): void {}

  public asInputStream(): InputStream<never> {
    return this as Stream as InputStream<never>;
  }

  public asOutputStream(): OutputStream<never> {
    return this as Stream as OutputStream<never>;
  }
}

const singletonInputStreamVoid =
  new VoidStreamImpl() as Stream as InputStreamVoid;

export function newInputStreamVoid(): InputStreamVoid {
  return singletonInputStreamVoid;
}

const singletonOutputStreamVoid =
  new VoidStreamImpl() as Stream as OutputStreamVoid;

export function newOutputStreamVoid(): OutputStreamVoid {
  return singletonOutputStreamVoid;
}
