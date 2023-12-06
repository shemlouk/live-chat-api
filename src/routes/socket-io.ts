import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";
import { z } from "zod";

let onlineUsersCount = 0;

const draftSchema = z.object({
  userId: z.string().uuid(),
  roomId: z.string().uuid(),
  content: z.string().min(1),
});

export async function socketIo(app: FastifyInstance) {
  app.ready((err) => {
    if (err) throw err;

    app.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      try {
        app.jwt.verify(token);
        next();
      } catch (error) {
        next(new Error("Unauthorized."));
      }
    });

    app.io.on("connection", (socket: Socket) => {
      console.info("A user has connected:", socket.id);
      onlineUsersCount++;

      socket.emit("online", JSON.stringify({ count: onlineUsersCount }));

      socket.broadcast.emit(
        "online",
        JSON.stringify({ count: onlineUsersCount })
      );

      socket.on("message", async (data) => {
        try {
          const { userId, roomId, content } = draftSchema.parse(
            JSON.parse(data)
          );

          const foundUser = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (!foundUser) return;

          const foundRoom = await prisma.room.findUnique({
            where: { id: roomId },
          });

          if (!foundRoom) return;

          const message = await prisma.message.create({
            data: {
              content,
              user_id: foundUser.id,
              room_id: foundRoom.id,
            },
          });

          socket.broadcast.emit(
            "chat",
            JSON.stringify({
              id: message.id,
              content: message.content,
              createdAt: message.created_at,
              user: {
                id: foundUser.id,
                name: foundUser.name,
              },
              room: {
                id: foundRoom.id,
                name: foundRoom.name,
              },
            })
          );
        } catch (error) {
          console.error(error);
        }
      });

      socket.on("disconnect", () => {
        console.info("A user has disconnected:", socket.id);
        onlineUsersCount--;

        socket.broadcast.emit(
          "online",
          JSON.stringify({ count: onlineUsersCount })
        );
      });
    });
  });
}
