import "dotenv/config";

import { BoletimQueryService } from "../../../../Contexts/Boletim/application/queries/BoletimQueries";
import { RegistrarNotaCommandHandler } from "../../../../Contexts/Boletim/application/commands/RegistrarNotaCommands";
import { MongoBoletimDisciplinaRepository } from "../../../../Contexts/Boletim/infrastructure/MongoBoletimDisciplinaRepository";
import { MongoMatriculasRepository } from "../../../../Contexts/Matriculas/infrastructure/MongoMatriculasRepository";
import { MongoVinculoDocenteRepository } from "../../../../Contexts/VinculoDocente/infrastructure/MongoVinculoDocenteRepository";
import { VinculoDocenteQueryService } from "../../../../Contexts/VinculoDocente/application/VinculoDocenteService";
import { RabbitMqEventBus } from "../../../../Contexts/Shared/RabbitMqEventBus";
import { connectMongo, disconnectMongo } from "../../../../Contexts/Shared/MongoConnection";
import { ensureIndexes } from "../../../../Contexts/Shared/MongoIndexes";
import { MongoUsuariosRepository } from "../../../../Contexts/IdentidadeAcesso/infrastructure/MongoUsuariosRepository";
import { LoginCommandHandler } from "../../../../Contexts/IdentidadeAcesso/application/LoginCommandHandler";
import { MongoCatalogoRepository } from "../../../../Contexts/CatalogoAcademico/infrastructure/MongoCatalogoRepository";
import { MongoAlunosRepository } from "../../../../Contexts/Alunos/infrastructure/MongoAlunosRepository";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente obrigatória não definida: ${name}`);
  return value;
}

export async function buildProductionContainer() {
  const mongoUri = requireEnv("MONGODB_URI");
  const rabbitUrl = requireEnv("RABBITMQ_URL");
  const exchange = requireEnv("RABBITMQ_EXCHANGE");
  const jwtSecret = requireEnv("JWT_SECRET");
  const frontendOrigin = process.env["FRONTEND_ORIGIN"] ?? "http://localhost:8032";

  const [dbName] = mongoUri.split("/").reverse();

  const db = await connectMongo(mongoUri, dbName);
  await ensureIndexes(db);

  const eventBus = new RabbitMqEventBus(rabbitUrl, exchange);
  await eventBus.connect();

  const boletimRepository = new MongoBoletimDisciplinaRepository(db);
  const matriculasRepository = new MongoMatriculasRepository(db);
  const vinculoDocenteRepository = new MongoVinculoDocenteRepository(db);
  const usuariosRepository = new MongoUsuariosRepository(db);
  const catalogoRepository = new MongoCatalogoRepository(db);
  const alunosRepository = new MongoAlunosRepository(db);

  const registrarNotaHandler = new RegistrarNotaCommandHandler(
    boletimRepository,
    matriculasRepository,
    vinculoDocenteRepository,
    eventBus
  );

  const boletimQueries = new BoletimQueryService(boletimRepository, matriculasRepository, catalogoRepository);
  const vinculoQueries = new VinculoDocenteQueryService(
    vinculoDocenteRepository,
    matriculasRepository,
    catalogoRepository,
    boletimRepository,
    alunosRepository
  );
  const loginHandler = new LoginCommandHandler(usuariosRepository, jwtSecret);

  const shutdown = async () => {
    await eventBus.disconnect();
    await disconnectMongo();
  };

  return {
    boletimQueries,
    vinculoQueries,
    registrarNotaHandler,
    loginHandler,
    jwtSecret,
    frontendOrigin,
    shutdown
  };
}
