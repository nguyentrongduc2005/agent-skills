import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

try {
  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      prisma
        .$disconnect()
        .then(() => {
          console.log("Prisma client disconnected.");
          process.exit(0);
        })
        .catch((err: unknown) => {
          console.error("Error during shutdown disconnect:", err);
          process.exit(1);
        });
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
} catch {
  console.error(
    "Startup failure: An error occurred during server initialization.",
  );
  process.exit(1);
}
