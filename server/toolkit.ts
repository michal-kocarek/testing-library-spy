import { kill, send, start } from "./src/subprocess";
import { getConfig, configure, screen } from "@testing-library/react";
import { url } from "inspector";

let isInitialized = false;
let observer: MutationObserver | undefined;
let oldValue = "";

// TODO: Report more information, e.g. test name...
// TODO: Can we report last executed query? .) E.g. if I reexport the library, then I could also provide render() method, and maybe some other stuff...
// TODO: This needs to play well with DEBUG / non-DEBUG mode.

const updateContents = () => {
  if (!isInitialized) {
    return;
  }

  const html = document.body.innerHTML;
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
        const element = args[0];
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

  const MutationObserverConstructor = window.MutationObserver;
  observer = new MutationObserverConstructor(updateContents);

  observer.observe(document.body, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
};

const enable = () =>
  !!(
    // Enable by ENV variable?
    (
      process.env.LIVE_PLAYGROUND_ENABLE === "true" ||
      // Or when Node.js debugger is active?
      url()
    )
  );

// TODO: Rename this to something like testing-library-spy
// TODO: Just dump out HTML nicely, with info about running test and connection status. And add link to download this package and the chrome extension

// TODO: Add here options object, with possibility to patch global object and/or screen.debug() or something to call notifyPlayground()...
export const initPlayground = () => {
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
};

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

// TODO: If we monkeypatch .debug(), can we then somehow stack what has been happening, to allow going back in time?

// TODO: How to detect afterAll/afterEach? https://github.com/testing-library/react-testing-library/blob/master/src/index.js

// TODO: Can we replace this with some unref(), so Jest doesn't bother?
afterAll(() => {
  if (observer) {
    observer.disconnect();
  }
  observer = undefined;

  kill();
});
