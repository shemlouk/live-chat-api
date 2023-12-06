import { PrismaClient } from "@prisma/client";

const seed = async () => {
  const prisma = new PrismaClient();

  await prisma.room.create({ data: { name: "Global Room" } });

  prisma.$disconnect;
};

seed();
