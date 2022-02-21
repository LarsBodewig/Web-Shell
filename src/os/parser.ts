import { Echo } from "../bin/echo";
import { isEmpty } from "../util/isEmpty";
import { Command, pipe, StreamFunction } from "./command";
import { path } from "./path";
import {
  InputStream,
  InputStreamVoid,
  newOutputStream,
  newOutputStreamVoid,
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
    _args: {}
  ): Promise<OutputStreamVoid> {
    return Promise.resolve(newOutputStreamVoid());
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
    _args: {}
  ): Promise<OutputStream<string>> {
    const output = newOutputStream<string>();
    while (input.canRead()) {
      const value = await input.read();
      output.write("" + value);
    }
    return output;
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

function splitCommands(input: string) {
  const splitCommands = input.split("|").filter((cmd) => !isEmpty(cmd));
  return splitCommands.map((splitCommand) => {
    const cmdName = splitCommand.split(" ")[0].trim();
    const cmdArgs = splitCommand.substring(cmdName.length).trim();
    return { name: cmdName, args: cmdArgs };
  });
}

function findInPath(name: string): Command<any, any, any> | undefined {
  return path.find((cmd) => cmd.name === name);
}
