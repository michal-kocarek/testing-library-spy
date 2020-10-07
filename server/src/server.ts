import execa, { ExecaChildProcess } from "execa";
import { join } from "path";
import { getPort } from "./subprocess/utils";
import debug from "debug";

let subprocess: ExecaChildProcess | undefined;

const logger = debug("testing-library-spy");

function useDebugColors() {
  // Leverage undocumented debug function
  const useColors = (debug as { useColors?: () => boolean }).useColors;

  return useColors && useColors() ? "yes" : undefined;
}

export function start(): void {
  if (subprocess) {
    throw new Error("Child is already started!");
  }

  // console.log('Starting subprocess at http://localhost:3888/');

  const SCRIPT_PATH = join(__dirname, "subprocess/index.js");

  const port = getPort();

  subprocess = execa.node(SCRIPT_PATH, {
    env: {
      TESTING_LIBRARY_SPY_PORT: `${port}`,
      DEBUG_COLORS: useDebugColors(),
    },
  });

  subprocess.catch((error) => {
    console.error("Testing Library Spy subprocess exited prematurely!");
    throw error;
  });

  subprocess.stdout.pipe(process.stdout);
  subprocess.stderr.pipe(process.stderr);

  console.info(`Testing Live Spy is at http://localhost:${port}/`);
}

export function send(data: string): void {
  if (!subprocess) {
    throw new Error("Testing Library Spy subprocess is not ready yet!");
  }

  logger("Sending message %o", data);
  subprocess.send(data);
}

export function kill(): void {
  if (!subprocess) {
    return;
  }

  subprocess.cancel();
  subprocess = undefined;
}
