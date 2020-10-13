import { kill, send, start } from "./server";
import {
  getConfig,
  configure,
  screen,
  prettyDOM,
} from "@testing-library/react";
import { url } from "inspector";

let isInitialized = false;
let observer: MutationObserver | undefined;
let oldValue = "";

declare global {
  const afterAll: undefined | ((callback: () => void) => void);
  const teardown: undefined | ((callback: () => void) => void);
}

// TODO: Report more information, e.g. test name...
// TODO: Can we report last executed query? .) E.g. if I reexport the library, then I could also provide render() method, and maybe some other stuff...
// TODO: This needs to play well with DEBUG / non-DEBUG mode.
// TODO: Rename this to something like testing-library-spy
// TODO: Just dump out HTML nicely, with info about running test and connection status. And add link to download this package and the chrome extension
// TODO: Add here options object, with possibility to patch global object and/or screen.debug() or something to call notifyPlayground()...

const updateContents = () => {
  if (!isInitialized) {
    return;
  }

  const html =
    prettyDOM(document.body, undefined, {
      highlight: false,
    }) || "";

  if (oldValue === html) {
    return;
  }

  oldValue = html;
  send(html);
};

const hookInTestingLibrary = () => {
  const { asyncWrapper, eventWrapper } = getConfig();
  configure({
    asyncWrapper: async (...args) => {
      try {
        return await asyncWrapper(...args);
      } finally {
        updateContents();
      }
    },
    eventWrapper: async (...args) => {
      try {
        // const element = args[0];
        return await eventWrapper(...args);
      } finally {
        updateContents();
      }
    },
  });
  const oldDebug = screen.debug;

  screen.debug = (...args) => {
    updateContents();
    oldDebug(...args);
  };
};

const hookToDom = () => {
  const window = document.defaultView;
  if (!window) {
    throw new Error("Window should be initialized by JSDOM!");
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  const MutationObserverConstructor = window.MutationObserver;
  observer = new MutationObserverConstructor(updateContents);

  observer.observe(document.body, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
};

const enable = () => {
  // Enable by ENV variable?
  if (process.env.LIVE_PLAYGROUND_ENABLE === "true") {
    return true;
  }

  // Or when Node.js debugger is active?
  if (url()) {
    return true;
  }

  return false;
};

const registerCleanupInTest = (): void => {
  // https://github.com/testing-library/react-testing-library/blob/220d8d4fd1/src/index.js#L11-23

  if (typeof afterAll === "function") {
    afterAll(destroySpyConsole);
  } else if (typeof teardown === "function") {
    teardown(destroySpyConsole);
  }
};

/**
 * Initialize Spy console.
 *
 * Will also hook into testing library, JSDOM, and if running inside tests, register its own cleanup at the end of the run.
 */
export const initSpyConsole = (): void => {
  if (!enable()) {
    return;
  }

  if (isInitialized) {
    return;
  }

  isInitialized = true;

  start();

  hookInTestingLibrary();
  hookToDom();

  registerCleanupInTest();
};

/**
 * Destroy Spy console.
 *
 * There is no need to call this manually, if your test runner supports either `afterAll()` or `teardown()` methods.
 */
export const destroySpyConsole = (): void => {
  if (!isInitialized) {
    return;
  }

  if (observer) {
    observer.disconnect();
  }
  observer = undefined;

  kill();

  isInitialized = false;
};

// TODO: If we monkeypatch .debug(), can we then somehow stack what has been happening, to allow going back in time?
