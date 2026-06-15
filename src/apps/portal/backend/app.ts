import express from "express";
import cors from "cors";
import { DomainError } from "../../../Contexts/Shared/DomainError";
import { AlunosController } from "./controllers/alunosController";
import { ProfessoresController } from "./controllers/professoresController";
import { AuthController } from "./controllers/authController";
import { buildRoutes } from "./routes";
import { BoletimQueryService } from "../../../Contexts/Boletim/application/queries/BoletimQueries";
import { RegistrarNotaCommandHandler } from "../../../Contexts/Boletim/application/commands/RegistrarNotaCommands";
import { VinculoDocenteQueryService } from "../../../Contexts/VinculoDocente/application/VinculoDocenteService";
import { LoginCommandHandler } from "../../../Contexts/IdentidadeAcesso/application/LoginCommandHandler";

interface AppDeps {
  boletimQueries: BoletimQueryService;
  vinculoQueries: VinculoDocenteQueryService;
  registrarNotaHandler: RegistrarNotaCommandHandler;
  loginHandler: LoginCommandHandler;
  jwtSecret: string;
  frontendOrigin: string;
}

function buildApp(deps: AppDeps): express.Application {
  const app = express();

  app.use(cors({ origin: deps.frontendOrigin, credentials: true }));

  const alunosController = new AlunosController(deps.boletimQueries);
  const professoresController = new ProfessoresController(
    deps.registrarNotaHandler,
    deps.boletimQueries,
    deps.vinculoQueries
  );
  const authController = new AuthController(deps.loginHandler);

  app.use(express.json());
  app.use(buildRoutes(alunosController, professoresController, authController, deps.jwtSecret));

  app.use((error: unknown, _: express.Request, response: express.Response, __: express.NextFunction) => {
    if (error instanceof DomainError) {
      response.status(400).json({ message: error.message });
      return;
    }

    if (error instanceof Error) {
      response.status(400).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: "Erro inesperado" });
  });

  return app;
}

// Cria app conectado ao MongoDB e RabbitMQ (produção)
export async function createProductionApp(): Promise<{ app: express.Application; shutdown: () => Promise<void> }> {
  const { buildProductionContainer } = await import("./dependency-injection/productionContainer");
  const container = await buildProductionContainer();
  return { app: buildApp(container), shutdown: container.shutdown };
}
