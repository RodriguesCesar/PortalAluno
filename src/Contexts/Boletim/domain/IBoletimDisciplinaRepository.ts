import { IdAluno, IdDisciplina, IdTurma } from "../../Shared/types";
import { BoletimDisciplina } from "./BoletimDisciplina";

export interface IBoletimDisciplinaRepository {
  salvar(boletim: BoletimDisciplina): Promise<void>;
  buscarPorAlunoTurmaDisciplina(
    alunoId: IdAluno,
    turmaId: IdTurma,
    disciplinaId: IdDisciplina
  ): Promise<BoletimDisciplina | null>;
  buscarPorTurmaDisciplina(turmaId: IdTurma, disciplinaId: IdDisciplina): Promise<BoletimDisciplina[]>;
  buscarPorAluno(alunoId: IdAluno): Promise<BoletimDisciplina[]>;
}
