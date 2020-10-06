import express, { Request, Response } from "express";
import { join } from "path";
import { StatusCodes } from "http-status-codes";

console.log("Starting subprocess...");

let oldValue = "";
const broadcasters = new Set<(data: string) => void>();

// TODO: Replace logger with that colorful stuff from knex, that does DEBUG:*
// TODO: Send message right after page is opened
// TODO: On error, disconnect and retry every 5 seconds
// TODO: Make sure that this always opens the compiled stuff directly in node.js, not in some crazy compiler

const broadcast = (value: string) => {
  if (oldValue === value) {
    return;
  }
  oldValue = value;

  broadcasters.forEach((callback) => {
    callback(value);
  });
  broadcasters.clear();
};

process.on("message", (message) => {
  console.log("Received message", message);
  broadcast(message);
});

const postDataRoute = async (req: Request, res: Response): Promise<void> => {
  if (req.body.nopoll) {
    res.status(200).json({ data: oldValue });

    return;
  }
  const receiver = new Promise((resolve, reject) => {
    req.on("close", () => {
      reject(new Error("Connection closed by client."));
    });

    broadcasters.add(resolve);
  });

  try {
    const result = await receiver;
    res.status(200).json({ data: result });
  } catch (e) {
    res.status(StatusCodes.NO_CONTENT);
  }
};

const app = express();
app.use(express.json());

const router = express.Router();
router.post("/data", postDataRoute);

router.use(
  "/",
  express.static(join(__dirname, "../../static"), {
    immutable: true,
    maxAge: 86400 * 365,
  })
);

app.use(router);

const PORT = 3888;
app.listen(PORT, () => {
  console.log(
    `React Testing Live Playground is ready at http://localhost:${PORT}/`
  );
});
