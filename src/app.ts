import fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import { socketIo } from "./routes/socket-io";
import { usersRoute } from "./routes/users-route";

const app = fastify();

app.register(fastifySocketIO, {
  cors: { origin: "*" },
});

app.register(usersRoute);
app.register(socketIo);

export { app };
