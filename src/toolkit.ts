import {kill, send, start} from './subprocess';
import {getConfig, configure, screen} from '@testing-library/react';
import {url} from 'inspector';

let isInitialized = false;
let observer: MutationObserver | undefined;
let oldValue = '';

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
  const {asyncWrapper, eventWrapper} = getConfig();
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
    throw new Error('Window should be initialized by JSDOM!');
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

const enable = () => !!(
  // Enable by ENV variable?
  process.env.LIVE_PLAYGROUND_ENABLE === 'true' ||
  // Or when Node.js debugger is active?
  url()
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

// Can we replace this with some unref(), so Jest doesn't bother?
afterAll(() => {
  if (observer) {
    observer.disconnect();
  }
  observer = undefined;

  kill();
});
