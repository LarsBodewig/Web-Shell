import { Echo } from "../bin/echo";
import { Pwd } from "../bin/pwd";
import { Command } from "./command";

export const path = [new Echo(), new Pwd()];

export function findInPath(name: string): Command<any, any, any> | undefined {
  return path.find((cmd) => cmd.name === name);
}
