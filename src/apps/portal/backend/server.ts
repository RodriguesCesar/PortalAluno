import "dotenv/config";
import { createProductionApp } from "./app";

const PORT = Number(process.env.PORT ?? 3000);

async function main() {
  const { app, shutdown } = await createProductionApp();

  const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Portal de notas rodando em http://localhost:${PORT}`);
  });

  const stop = async () => {
    server.close();
    await shutdown();
    // eslint-disable-next-line no-console
    console.log("Servidor encerrado.");
    process.exit(0);
  };

  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
}

main().catch((error) => {
  console.error("Falha ao inicializar servidor:", error);
  process.exit(1);
});

