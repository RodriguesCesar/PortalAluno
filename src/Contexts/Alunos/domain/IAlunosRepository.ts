import { IdAluno } from "../../Shared/types";
import { Aluno } from "./AlunoModel";

export interface IAlunosRepository {
  buscarPorId(alunoId: IdAluno): Promise<Aluno | null>;
  buscarNomePorId(alunoId: IdAluno): Promise<string | null>;
}
