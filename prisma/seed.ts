import { PrismaClient } from "@prisma/client";

const seed = async () => {
  const prisma = new PrismaClient();

  const alreadyExists = await prisma.room.findFirst({
    where: { name: "Global Room" },
  });

  if (!alreadyExists) {
    await prisma.room.create({ data: { name: "Global Room" } });
  }

  prisma.$disconnect;
};

seed();
