import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";

export async function roomsRoute(app: FastifyInstance) {
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.status(401).send();
    }
  });

  app.get("/", async (request, reply) => {
    const rooms = await prisma.room.findMany();
    reply.send({ rooms });
  });
}
