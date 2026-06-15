import { IdProfessor, IdTurma, IdDisciplina } from "../../Shared/types";
import { VinculoDocente } from "./VinculoDocente";

export interface IVinculoDocenteRepository {
  salvar(vinculo: VinculoDocente): Promise<void>;
  buscarPorProfessor(professorId: IdProfessor): Promise<VinculoDocente[]>;
  buscarPorId(vinculoId: string): Promise<VinculoDocente | null>;
  existe(professorId: IdProfessor, turmaId: IdTurma, disciplinaId: IdDisciplina): Promise<boolean>;
}
