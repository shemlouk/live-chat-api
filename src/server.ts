import { app } from "./app";
import { envs } from "./lib/envs";

app.listen({ host: "0.0.0.0", port: envs.PORT }).then(() => {
  console.info("Server started!");
});
