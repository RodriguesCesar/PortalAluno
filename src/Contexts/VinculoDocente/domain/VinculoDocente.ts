import { IdCurso, IdDisciplina, IdProfessor, IdTurma } from "../../Shared/types";

export type VinculoDocente = {
  id: string;
  professorId: IdProfessor;
  cursoId: IdCurso;
  turmaId: IdTurma;
  disciplinaId: IdDisciplina;
}
