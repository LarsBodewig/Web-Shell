import { Echo } from "../bin/echo";
import { Command, StreamFunction } from "./command";
import { findInPath } from "./path";
import {
  InputStream,
  InputStreamVoid,
  newInputStreamVoid,
  OutputStream,
  OutputStreamVoid,
} from "./stream";

class Start extends Command<InputStreamVoid, {}, OutputStreamVoid> {
  constructor() {
    super("Start");
  }

  protected parseArgs(_args?: string): {} {
    return {};
  }

  protected process(
    _input: InputStreamVoid,
    _args: {},
    output: OutputStreamVoid
  ): Promise<OutputStreamVoid> {
    return Promise.resolve(output);
  }
}

class Converter extends Command<InputStream<any>, {}, string> {
  constructor() {
    super("Converter");
  }

  protected parseArgs(_args?: string): {} {
    return {};
  }

  protected async process(
    input: InputStream<any>,
    _args: {},
    output: OutputStream<string>
  ): Promise<OutputStream<string>> {
    while (await input.canRead()) {
      output.write("" + input.read());
    }
    return Promise.resolve(output);
  }
}

export function parse(
  input: string
): StreamFunction<InputStreamVoid, OutputStream<string>> {
  try {
    let request: StreamFunction<
      InputStreamVoid,
      OutputStream<any>
    > = new Start().call();
    for (let command of splitCommands(input)) {
      const cmdFromPath = findInPath(command.name);
      if (cmdFromPath) {
        const call = cmdFromPath.call(command.args);
        request = pipe(request, call);
      } else {
        throw new Error("webshell: " + command.name + ": command not found");
      }
    }
    request = pipe(request, new Converter().call());
    return request;
  } catch (err) {
    console.error(err);
    return new Echo().call("" + err);
  }
}

export function pipe<I, T, O>(
  funcA: StreamFunction<InputStream<I>, OutputStream<T>>,
  funcB: StreamFunction<InputStream<T>, OutputStream<O>>
): StreamFunction<InputStream<I>, OutputStream<O>> {
  return (input: InputStream<I>) => {
    const output = funcA(input);
    return funcB(output.asInputStream());
  };
}

export async function run(
  command: StreamFunction<InputStreamVoid, OutputStream<string>>
): Promise<InputStream<string>> {
  const input = newInputStreamVoid();
  const output = command(input);
  return output.asInputStream();
}

function splitCommands(input: string) {
  const splitCommands = input
    .split("|")
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0);
  return splitCommands.map((splitCommand) => {
    const cmdName = splitCommand.split(" ")[0].trim();
    const cmdArgs = splitCommand.substring(cmdName.length).trim();
    return { name: cmdName, args: cmdArgs };
  });
}
