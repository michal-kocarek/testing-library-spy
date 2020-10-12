import execa, { ExecaChildProcess } from "execa";
import debug from "debug";
import { join } from "path";

import { SubprocessMessageType } from "./types";

import { getPort } from "./subprocess/utils";

const logger = debug("testing-library-spy");

let subprocess: ExecaChildProcess | undefined;

/**
 * Subprocess won't be able to find out whether it's running inside TTY, so we need to manually pass down the setting.
 */
function useDebugColors(): "yes" | undefined {
  // Leverage undocumented debug function
  const useColors = (debug as { useColors?: () => boolean }).useColors;

  return useColors && useColors() ? "yes" : undefined;
}

export function start(): void {
  if (subprocess) {
    return;
  }

  const SCRIPT_PATH = join(__dirname, "subprocess/index.js");
  const port = getPort();

  logger("Starting subprocess...");

  subprocess = execa.node(SCRIPT_PATH, {
    env: {
      TESTING_LIBRARY_SPY_PORT: `${port}`,
      DEBUG_COLORS: useDebugColors(),
    },
  });

  logger("Subprocess started.");

  subprocess.catch((error) => {
    console.error("Testing Library Spy subprocess exited prematurely!");
    throw error;
  });

  subprocess.stdout.pipe(process.stdout);
  subprocess.stderr.pipe(process.stderr);

  console.info(`Testing Library Spy is at http://localhost:${port}/`);
}

export function send(data: SubprocessMessageType): void {
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

  logger("Killing subprocess...");

  subprocess.cancel();
  subprocess = undefined;

  logger("Subprocess killed.");
}
