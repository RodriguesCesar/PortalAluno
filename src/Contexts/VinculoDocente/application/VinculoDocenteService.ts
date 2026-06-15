import { IdAluno, IdProfessor } from "../../Shared/types";
import { IMatriculasRepository } from "../../Matriculas/domain/IMatriculasRepository";
import { IVinculoDocenteRepository } from "../domain/IVinculoDocenteRepository";
import { ICatalogoRepository } from "../../CatalogoAcademico/domain/ICatalogoRepository";
import { IAlunosRepository } from "../../Alunos/domain/IAlunosRepository";
import { IBoletimDisciplinaRepository } from "../../Boletim/domain/IBoletimDisciplinaRepository";
import { Aluno } from "../../Alunos/domain/AlunoModel";
export type VinculoEnriquecido = {
  vinculoId: string;
  cursoId: string;
  turmaId: string;
  disciplinaId: string;
  curso: string;
  turma: string;
  disciplina: string;
};

export type AlunoVinculoEnriquecido = {
  alunoId: IdAluno;
  nome: string;
  p1?: number;
  p2?: number;
  p3?: number;
  mediaFinal?: number;
  status: string;
};

export class VinculoDocenteQueryService {
  constructor(
    private readonly vinculoRepository: IVinculoDocenteRepository,
    private readonly matriculasRepository: IMatriculasRepository,
    private readonly catalogoRepository: ICatalogoRepository,
    private readonly boletimRepository: IBoletimDisciplinaRepository,
    private readonly alunosRepository: IAlunosRepository
  ) {}

  async buscarVinculosDoProfessor(professorId: IdProfessor): Promise<VinculoEnriquecido[]> {
    const vinculos = await this.vinculoRepository.buscarPorProfessor(professorId);
    return Promise.all(
      vinculos.map(async (v) => {
        const turmaInfo = await this.catalogoRepository.buscarTurma(v.turmaId);
        const cursoInfo = turmaInfo ? await this.catalogoRepository.buscarCurso(turmaInfo.cursoId) : null;
        const disciplinaInfo = turmaInfo
          ? await this.catalogoRepository.buscarDisciplinaEmCurso(turmaInfo.cursoId, v.disciplinaId)
          : null;
        return {
          vinculoId: v.id,
          cursoId: v.cursoId,
          turmaId: v.turmaId,
          disciplinaId: v.disciplinaId,
          curso: cursoInfo?.nome ?? v.cursoId,
          turma: turmaInfo?.nome ?? v.turmaId,
          disciplina: disciplinaInfo?.nome ?? v.disciplinaId,
        };
      })
    );
  }

  async buscarAlunosPorVinculoDocente(vinculoId: string): Promise<AlunoVinculoEnriquecido[]> {
    const vinculo = await this.vinculoRepository.buscarPorId(vinculoId);
    if (!vinculo) return [];

    const alunoIds = await this.matriculasRepository.buscarAlunosPorTurmaDisciplina(
      vinculo.turmaId,
      vinculo.disciplinaId
    );

    return Promise.all(
      alunoIds.map(async (alunoId) => {
        const aluno = await this.alunosRepository.buscarPorId(alunoId);
        const nome = aluno ? aluno.nome : '';
        const boletim = await this.boletimRepository.buscarPorAlunoTurmaDisciplina(
          alunoId,
          vinculo.turmaId,
          vinculo.disciplinaId
        );
        if (!boletim) {
          return { alunoId, nome, status: "CURSANDO" };
        }
        const notas = boletim.obterNotas();
        return {
          alunoId,
          nome,
          p1: notas.p1,
          p2: notas.p2,
          p3: notas.p3,
          mediaFinal: boletim.calcularMediaFinal() ?? undefined,
          status: boletim.obterStatus(),
        };
      })
    );
  }

  async buscarElegiveisP3ParaVinculo(vinculoId: string): Promise<AlunoVinculoEnriquecido[]> {
    const vinculo = await this.vinculoRepository.buscarPorId(vinculoId);
    if (!vinculo) return [];

    const boletins = await this.boletimRepository.buscarPorTurmaDisciplina(vinculo.turmaId, vinculo.disciplinaId);
    const elegiveis = boletins.filter((b) => b.estaElegivelParaP3());

    return Promise.all(
      elegiveis.map(async (b) => {
        const aluno = (await this.alunosRepository.buscarPorId(b.alunoId));
        const notas = b.obterNotas();
        return {
          alunoId: b.alunoId,
          nome: aluno ? aluno.nome : '',
          p1: notas.p1,
          p2: notas.p2,
          mediaFinal: b.calcularMediaFinal() ?? undefined,
          status: b.obterStatus(),
        };
      })
    );
  }
}
