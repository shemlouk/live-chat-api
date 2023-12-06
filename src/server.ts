import { app } from "./app";
import { envs } from "./lib/envs";

app.listen({ port: envs.PORT }).then(() => {
  console.info("Server started!");
});
