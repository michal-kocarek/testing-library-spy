import execa, { ExecaChildProcess } from "execa";
import { resolve } from "path";

// https://www.npmjs.com/package/debug for debugging

let child: ExecaChildProcess | undefined;

export function start(): void {
  if (child) {
    throw new Error("Child is already started!");
  }

  // console.log('Starting subprocess at http://localhost:3888/');

  // TODO: Replace fork with spawn
  // TODO: Compile it from typescript to JS

  const SCRIPT_PATH = resolve(__dirname, "server/index");

  // TODO: What if child exits prematurely!
  child = execa.node(SCRIPT_PATH, {});

  console.log(
    "React Testing Live Playground available at http://localhost:3888/"
  );
}

export function send(data: string): void {
  if (!child) {
    throw new Error("Child is not ready yet!");
  }

  child.send(data);
}

export function kill(): void {
  if (!child) {
    return;
  }

  child.kill("SIGTERM");
  child = undefined;
}
