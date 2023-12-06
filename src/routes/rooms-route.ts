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

  app.get("/:roomId", async (request, reply) => {
    const { roomId } = request.params as { roomId: string };

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) reply.status(404).send();

    reply.send({ room });
  });

  app.get("/:roomId/messages/recent", async (request, reply) => {
    const { roomId } = request.params as { roomId: string };

    const messages = await prisma.message.findMany({
      where: { room_id: roomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: -10,
    });

    const formattedMessages = messages.map((message) => {
      return {
        id: message.id,
        content: message.content,
        createdAt: message.created_at,
        user: message.user,
        room: message.room,
      };
    });

    reply.send({ messages: formattedMessages });
  });
}
