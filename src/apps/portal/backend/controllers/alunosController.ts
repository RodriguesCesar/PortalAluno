import { Request, Response } from "express";
import { BoletimQueryService } from "../../../../Contexts/Boletim/application/queries/BoletimQueries";

function getParam(request: Request, key: string): string {
  const value = request.params[key];
  if (typeof value !== "string") {
    throw new Error(`Parâmetro inválido: ${key}`);
  }
  return value;
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
    const turmaId = request.query.turmaId as string;
    const status = await this.boletimQueries.buscarStatusDoAlunoNaDisciplina(alunoId, turmaId, disciplinaId);
    response.json({ status });
  };

  buscarNotas = async (request: Request, response: Response) => {
    const alunoId = getParam(request, "alunoId");
    const disciplinaId = getParam(request, "disciplinaId");
    const turmaId = request.query.turmaId as string;
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
