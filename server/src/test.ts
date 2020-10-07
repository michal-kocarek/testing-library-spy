import { send, start } from "./server";

start();

send("Hello");

setInterval(() => {
  const value = `val${Math.random()}`;
  send(value);
}, 5000);

// TODO: Should add callback to see if it works or not

// TODO: Should handle quitting/errors of either of them

// TODO: Replace logger with that colorful stuff from knex, that does DEBUG:*
// TODO: Send message right after page is opened
// TODO: On error, disconnect and retry every 5 seconds
// TODO: Make sure that this always opens the compiled stuff directly in node.js, not in some crazy compiler

// TODO: Do dependencies dat @types/* na to, co budu pouzivat ve zkompilovanych .d.ts
