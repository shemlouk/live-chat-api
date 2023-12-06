import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";

let onlineUsersCount = 0;

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

      socket.on("message", (data) => {
        const message = JSON.parse(data);
        message["id"] = randomUUID();

        socket.broadcast.emit("chat", JSON.stringify(message));
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
