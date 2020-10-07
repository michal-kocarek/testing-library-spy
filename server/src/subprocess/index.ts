import debug from "debug";
import express, { static as staticHandler } from "express";
import { createServer, Server as HttpServer } from "http";
import { join } from "path";
import socketIo, { Server as SocketIoServer } from "socket.io";

import { getPort } from "./utils";

const logger = debug("testing-library-spy:subprocess");

const CLIENT_ASSETS_PATH = join(__dirname, "../../../client/dist");

process.on("unhandledRejection", (error) => {
  throw error;
});

async function startServer(): Promise<{
  server: HttpServer;
  io: SocketIoServer;
}> {
  logger("Starting server...");

  const app = express();
  app.use("/", staticHandler(CLIENT_ASSETS_PATH, { maxAge: "1y" }));

  const server = createServer(app);

  const port = getPort();

  await new Promise((resolve) => {
    server.listen(port, resolve);
  });

  logger(`Server started at port ${port}`);

  const io = socketIo(server);

  return { io, server };
}

async function run() {
  const { io } = await startServer();

  let lastMessage: string; // TODO: Type this properly

  io.on("connection", (socket) => {
    if (lastMessage === undefined) {
      logger("New client connected, but no new message to send.");
    } else {
      logger("New client connected, sending last message %s", lastMessage);
      socket.emit("spy:message", lastMessage);
    }
  });

  process.on("message", (message: string) => {
    logger("Got message %o", message);
    io.volatile.emit("spy:message", message);
    lastMessage = message;
  });
}

run();
