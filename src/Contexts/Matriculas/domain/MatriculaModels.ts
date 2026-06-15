import { IdAluno, IdCurso, IdDisciplina, IdTurma } from "../../Shared/types";

export type AlunoMatriculado = {
  id: string;
  alunoId: IdAluno;
  cursoId: IdCurso;
  turmaId: IdTurma;
  periodoLetivo: string;
}

export type MatriculaDisciplina = {
  id: string;
  alunoMatriculadoId: string;
  disciplinaId: IdDisciplina;
}
