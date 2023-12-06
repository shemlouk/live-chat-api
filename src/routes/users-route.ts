import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodError, z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).max(16),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16),
});

export async function usersRoute(app: FastifyInstance) {
  app.post("/signup", async (request, reply) => {
    try {
      const { name, email, password } = signUpSchema.parse(request.body);

      const hashedPassword = await bcrypt.hash(password, 6);

      const user = await prisma.user.findUnique({ where: { email } });
      if (user) return reply.status(409).send();

      await prisma.user.create({
        data: { name, email, password_hash: hashedPassword },
      });

      return reply.status(201).send();
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(422).send({ message: error.format() });
      }
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });

  app.post("/signin", async (request, reply) => {
    try {
      const { email, password } = signInSchema.parse(request.body);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return reply.status(404).send();

      const passwordsMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordsMatch) return reply.status(401).send();

      const token = app.jwt.sign({ sub: user.id });

      return reply.send({
        user: {
          id: user.id,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(422).send({ message: error.format() });
      }
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
