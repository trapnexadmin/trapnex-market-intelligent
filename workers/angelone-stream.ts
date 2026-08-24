/**
 * Optional long-running worker entrypoint.
 *
 * For production, run the stream manager in a dedicated Node worker/process
 * rather than relying on a serverless function lifetime.
 *
 * The Next.js API route is useful for local development and controlled
 * deployments; this worker is the intended production boundary.
 */
import { getAngelStreamManager } from "../lib/providers/angelone/stream";

async function main() {
  const manager = getAngelStreamManager();
  await manager.start();

  const shutdown = async () => {
    await manager.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log("TRAPNEX Angel One stream worker started.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
