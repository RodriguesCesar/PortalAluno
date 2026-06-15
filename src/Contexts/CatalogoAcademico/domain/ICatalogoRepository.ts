import { IdCurso, IdDisciplina, IdTurma } from "../../Shared/types";

export type TurmaInfo = {
  nome: string;
  cursoId: IdCurso;
}

export type CursoInfo = {
  nome: string;
}

export type DisciplinaInfo = {
  nome: string;
}

export interface ICatalogoRepository {
  buscarTurma(turmaId: IdTurma): Promise<TurmaInfo | null>;
  buscarCurso(cursoId: IdCurso): Promise<CursoInfo | null>;
  buscarDisciplinaEmCurso(cursoId: IdCurso, disciplinaId: IdDisciplina): Promise<DisciplinaInfo | null>;
}
