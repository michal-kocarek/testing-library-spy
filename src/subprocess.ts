import { resolve } from "path";
import { ChildProcess, fork } from "child_process";

let child: ChildProcess | undefined;

export function start(): void {
  if (child) {
    throw new Error("Child is already started!");
  }

  // console.log('Starting subprocess at http://localhost:3888/');

  // TODO: Replace fork with spawn
  // TODO: Compile it from typescript to JS

  const path = resolve(__dirname, "server/index");
  child = fork(path, [], {
    // TODO: make sure this gets propagated to parent process... If something goes wrong
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

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
