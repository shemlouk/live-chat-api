/** @type {import("fastify")} */

import { Server } from "socket.io";

interface ServerToClientEvents {
  chat: (data: string) => void;
  online: (data: string) => void;
}

interface ClientToServerEvents {
  chat: (data: string) => void;
}

declare module "fastify" {
  interface FastifyInstance {
    io: Server<ServerToClientEvents, ClientToServerEvents>;
  }
}
