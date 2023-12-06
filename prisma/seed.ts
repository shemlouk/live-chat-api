import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.room.create({ data: { name: "Global Room" } });
};

seed();
