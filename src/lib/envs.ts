import "dotenv/config";
import { z } from "zod";

const envsSchema = z.object({
  PORT: z.coerce.number().default(5555),
  JWT_SECRET: z.string().min(1),
});

const envs = envsSchema.parse(process.env);

export { envs };
