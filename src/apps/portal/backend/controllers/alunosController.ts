import { Request, Response } from "express";
import { z } from "zod";
import { BoletimQueryService } from "../../../../Contexts/Boletim/application/queries/BoletimQueries";

function getParam(request: Request, key: string): string {
  return z.string().min(1, `Parâmetro inválido: ${key}`).parse(request.params[key]);
}

function getTurmaId(request: Request): string {
  const querySchema = z.object({
    turmaId: z.string().min(1, "Parâmetro inválido: turmaId")
  });

  return querySchema.parse(request.query).turmaId;
}

export class AlunosController {
  constructor(private readonly boletimQueries: BoletimQueryService) {}

  buscarDisciplinasAtuais = async (request: Request, response: Response) => {
    const alunoId = getParam(request, "alunoId");
    const data = await this.boletimQueries.buscarDisciplinasAtuaisDoAluno(alunoId);
    response.json(data);
  };

  buscarDisciplinasConcluidas = async (request: Request, response: Response) => {
    const alunoId = getParam(request, "alunoId");
    const data = await this.boletimQueries.buscarDisciplinasConcluidasDoAluno(alunoId);
    response.json(data);
  };

  buscarSituacao = async (request: Request, response: Response) => {
    const alunoId = getParam(request, "alunoId");
    const disciplinaId = getParam(request, "disciplinaId");
    const turmaId = getTurmaId(request);
    const status = await this.boletimQueries.buscarStatusDoAlunoNaDisciplina(alunoId, turmaId, disciplinaId);
    response.json({ status });
  };

  buscarNotas = async (request: Request, response: Response) => {
    const alunoId = getParam(request, "alunoId");
    const disciplinaId = getParam(request, "disciplinaId");
    const turmaId = getTurmaId(request);
    const data = await this.boletimQueries.buscarNotasDoAlunoNaDisciplina(alunoId, turmaId, disciplinaId);
    response.json(data);
  };

  buscarGraficoMedia = async (request: Request, response: Response) => {
    const alunoId = getParam(request, "alunoId");
    const turmaId = getParam(request, "turmaId");
    const disciplinaId = getParam(request, "disciplinaId");
    const data = await this.boletimQueries.buscarGraficoMediaDisciplinaTurma(alunoId, turmaId, disciplinaId);
    response.json(data);
  };
}
