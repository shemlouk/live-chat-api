import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodError, z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(1),
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
    }
  });
}
