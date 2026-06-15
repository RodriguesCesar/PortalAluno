import { Request, Response } from "express";
import { z } from "zod";
import { RegistrarNotaCommandHandler } from "../../../../Contexts/Boletim/application/commands/RegistrarNotaCommands";
import { BoletimQueryService } from "../../../../Contexts/Boletim/application/queries/BoletimQueries";
import { VinculoDocenteQueryService } from "../../../../Contexts/VinculoDocente/application/VinculoDocenteService";

function getParam(request: Request, key: string): string {
  const value = request.params[key];
  if (typeof value !== "string") {
    throw new Error(`Parâmetro inválido: ${key}`);
  }
  return value;
}

const notaSchema = z.object({
  alunoId: z.string().min(1),
  turmaId: z.string().min(1),
  disciplinaId: z.string().min(1),
  nota: z.number().min(0).max(10)
});

export class ProfessoresController {
  constructor(
    private readonly registrarNotaHandler: RegistrarNotaCommandHandler,
    private readonly boletimQueries: BoletimQueryService,
    private readonly vinculoQueries: VinculoDocenteQueryService
  ) {}

  buscarVinculos = async (request: Request, response: Response) => {
    const professorId = getParam(request, "professorId");
    const data = await this.vinculoQueries.buscarVinculosDoProfessor(professorId);
    response.json(data);
  };

  buscarAlunosPorVinculo = async (request: Request, response: Response) => {
    const vinculoId = getParam(request, "vinculoId");
    const alunos = await this.vinculoQueries.buscarAlunosPorVinculoDocente(vinculoId);
    response.json(alunos);
  };

  registrarP1 = async (request: Request, response: Response) => {
    const professorId = getParam(request, "professorId");
    const payload = notaSchema.parse(request.body);
    await this.registrarNotaHandler.registrarP1({ professorId, ...payload });
    response.status(204).send();
  };

  registrarP2 = async (request: Request, response: Response) => {
    const professorId = getParam(request, "professorId");
    const payload = notaSchema.parse(request.body);
    await this.registrarNotaHandler.registrarP2({ professorId, ...payload });
    response.status(204).send();
  };

  registrarP3 = async (request: Request, response: Response) => {
    const professorId = getParam(request, "professorId");
    const payload = notaSchema.parse(request.body);
    await this.registrarNotaHandler.registrarP3({ professorId, ...payload });
    response.status(204).send();
  };

  buscarElegiveisP3 = async (request: Request, response: Response) => {
    const vinculoId = getParam(request, "vinculoId");
    const alunos = await this.vinculoQueries.buscarElegiveisP3ParaVinculo(vinculoId);
    response.json(alunos);
  };
}
