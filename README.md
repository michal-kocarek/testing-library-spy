# Testing Library Spy

Real-time spying of HTML rendered by [Testing Library](https://testing-library.com/).

// TODO: Put an image here

Testing Library Spy is useful when writing and debugging tests that leverage Testing Library
to render the HTML. It enables you to see currently rendered HTML while debugging the test
and stepping between Testing Library commands & DOM updates.

## Installation

This module is distributed via [npm](https://www.npmjs.com) and should be installed as one of your project's `devDependencies`:

```shell
npm install --save-dev testing-library-spy```
```

or for installation via [yarn](https://yarnpkg.com/)

```shell
yarn add -D testing-library-spy
```

## Usage in test runners

1. Initialize Spy console before test run:

```javascript
const { initSpyConsole } = require('testing-library-spy');

initSpyConsole();
```

Command detects whether debugger is running and in that case enables spying functionality.
In case when process is run normally (such as during CI), functionality is not enabled at all.

If using [Jest](https://jestjs.io/), add code to one of files inside one of files referenced inside `setupFiles` directive inside your `jest.config.js`.

2. Place breakpoint inside test

3. Run that test with debugger

4. Open Spy console in `http://localhost:3888`

5. Step through the test to see changes in console

Note: HTML output does not update every time. Some changes (such as React updates, DOM mutations) need to happen asynchronously. Therefore, feel free to add arbitrary waiting time into your test during debugging.

Note: use monkey-patched `screen.debug()` synchronously refresh Spy console in addition to dumping into the console.

# Configuration

**Environment variables:**

* `LIVE_PLAYGROUND_ENABLE` (default: _not set_) - Set to `"true"` to force enabling the Spy console. Normally it runs only if debugger is active.

# License

[MIT](LICENSE)
