import { Echo } from "../bin/echo";
import { Command } from "./command";

export const path = [new Echo()];

export function findInPath(name: string): Command<any, any, any> | undefined {
  return path.find((cmd) => cmd.name === name);
}
