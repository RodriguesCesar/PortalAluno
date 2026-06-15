import { IdCurso, IdDisciplina, IdTurma } from "../../Shared/types";

export type Curso = {
  id: IdCurso;
  nome: string;
  disciplinasIds: IdDisciplina[];
}

export type Turma = {
  id: IdTurma;
  cursoId: IdCurso;
  periodoLetivo: string;
}
