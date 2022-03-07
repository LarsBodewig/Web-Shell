import { Echo } from "../bin/echo";
import { Ping } from "../bin/ping";
import { Pwd } from "../bin/pwd";
import { Tail } from "../bin/tail";
import { Command } from "./command";

export const path = [new Echo(), new Ping(), new Pwd(), new Tail()];

export function findInPath(name: string): Command<any, any, any> | undefined {
  return path.find((cmd) => cmd.name === name);
}
