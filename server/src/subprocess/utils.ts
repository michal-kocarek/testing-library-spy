const DEFAULT_PORT = 3888;

export function getPort(): number {
  return (
    (process.env.TESTING_LIBRARY_SPY_PORT &&
      parseInt(process.env.TESTING_LIBRARY_SPY_PORT, 10)) ||
    DEFAULT_PORT
  );
}
