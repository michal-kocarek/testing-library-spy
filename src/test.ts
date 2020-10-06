import {send, start} from './subprocess';

start();

send('Hello');

setInterval(() => {
  const value = `val${Math.random()}`;
  send(value);
}, 5000);

// TODO: Should add callback to see if it works or not

// TODO: Should handle quitting/errors of either of them
