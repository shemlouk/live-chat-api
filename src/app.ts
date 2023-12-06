import fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import { socketIo } from "./routes/socket-io";

const app = fastify();

app.register(fastifySocketIO, {
  cors: { origin: "*" },
});

app.register(socketIo);

export { app };
