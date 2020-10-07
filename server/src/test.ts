import { send, start } from "./server";

start();

send("Hello");

setInterval(() => {
  const value = `val${Math.random()}`;
  send(value);
}, 5000);

// TODO: Do dependencies dat @types/* na to, co budu pouzivat ve zkompilovanych .d.ts
// TODO: How to slow down stuff? child_process.execSync("sleep 5"); or using execa: https://stackoverflow.com/a/50098685
