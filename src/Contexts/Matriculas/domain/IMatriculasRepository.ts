import { IdAluno, IdDisciplina, IdTurma } from "../../Shared/types";
import { AlunoMatriculado, MatriculaDisciplina } from "./MatriculaModels";

export interface IMatriculasRepository {
  salvarAlunoMatriculado(value: AlunoMatriculado): Promise<void>;
  salvarMatriculaDisciplina(value: MatriculaDisciplina): Promise<void>;
  buscarAlunoMatriculadoPorAlunoTurma(alunoId: IdAluno, turmaId: IdTurma): Promise<AlunoMatriculado | null>;
  buscarDisciplinasDoAluno(alunoId: IdAluno): Promise<Array<{ turmaId: IdTurma; disciplinaId: IdDisciplina }>>;
  buscarAlunosPorTurmaDisciplina(turmaId: IdTurma, disciplinaId: IdDisciplina): Promise<IdAluno[]>;
}
