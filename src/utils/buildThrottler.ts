import PromiseThrottle from "promise-throttle";

/**
 * Utility function to provide a promiseThrottle instance for throttling
 * requests to the tool APIs.
 */
export function buildThrottler<TResponse>(
  requestsPerSecond: number,
  fetchFunc: (...fetchArgs: Array<unknown>) => TResponse,
): {
  promiseThrottle: typeof PromiseThrottle;
  throttledFunc: (...args: Array<unknown>) => Promise<TResponse>;
} {
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond,
    promiseImplementation: Promise,
  });

  const throttledFunc = (...args: Array<unknown>): Promise<TResponse> =>
    new Promise((resolve, reject) =>
      fetchFunc
        .call(null, ...args)
        .then((response: TResponse) => {
          resolve(response);
        })
        .catch((err: Error) => {
          reject(err);
        }),
    );

  return {
    promiseThrottle,
    throttledFunc,
  };
}