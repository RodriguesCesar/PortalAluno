import { IBoletimDisciplinaRepository } from "../../domain/IBoletimDisciplinaRepository";
import { IdAluno, IdDisciplina, IdTurma, StatusDisciplinaAluno } from "../../../Shared/types";
import { IMatriculasRepository } from "../../../Matriculas/domain/IMatriculasRepository";
import { ICatalogoRepository } from "../../../CatalogoAcademico/domain/ICatalogoRepository";

type DisciplinaAlunoStatus = {
  turmaId: IdTurma;
  disciplinaId: IdDisciplina;
  nome: string;
  curso: string;
  turma: string;
  status: StatusDisciplinaAluno;
};

type DisciplinaAlunoConcluida = DisciplinaAlunoStatus & {
  mediaFinal: number | null;
};

export class BoletimQueryService {
  constructor(
    private readonly boletimRepository: IBoletimDisciplinaRepository,
    private readonly matriculasRepository: IMatriculasRepository,
    private readonly catalogoRepository: ICatalogoRepository
  ) {}

  private async enriquecerDisciplina(
    turmaId: IdTurma,
    disciplinaId: IdDisciplina
  ): Promise<{ nome: string; curso: string; turma: string }> {
    const turmaInfo = await this.catalogoRepository.buscarTurma(turmaId);
    const cursoInfo = turmaInfo ? await this.catalogoRepository.buscarCurso(turmaInfo.cursoId) : null;
    const disciplinaInfo = turmaInfo
      ? await this.catalogoRepository.buscarDisciplinaEmCurso(turmaInfo.cursoId, disciplinaId)
      : null;
    return {
      nome: disciplinaInfo?.nome ?? disciplinaId,
      curso: cursoInfo?.nome ?? "",
      turma: turmaInfo?.nome ?? turmaId,
    };
  }

  async buscarDisciplinasAtuaisDoAluno(alunoId: IdAluno): Promise<DisciplinaAlunoStatus[]> {
    const disciplinas = await this.matriculasRepository.buscarDisciplinasDoAluno(alunoId);
    const resultado = await Promise.all(
      disciplinas.map(async (item) => {
        const boletim = await this.boletimRepository.buscarPorAlunoTurmaDisciplina(
          alunoId,
          item.turmaId,
          item.disciplinaId
        );
        const status = boletim?.obterStatus() ?? "CURSANDO";
        const info = await this.enriquecerDisciplina(item.turmaId, item.disciplinaId);
        return { ...item, ...info, status };
      })
    );
    return resultado.filter((item) => item.status === "CURSANDO");
  }

  async buscarDisciplinasConcluidasDoAluno(alunoId: IdAluno): Promise<DisciplinaAlunoConcluida[]> {
    const disciplinas = await this.matriculasRepository.buscarDisciplinasDoAluno(alunoId);
    const resultado = await Promise.all(
      disciplinas.map(async (item) => {
        const boletim = await this.boletimRepository.buscarPorAlunoTurmaDisciplina(
          alunoId,
          item.turmaId,
          item.disciplinaId
        );
        const status = boletim?.obterStatus() ?? "CURSANDO";
        const mediaFinal = boletim?.calcularMediaFinal() ?? null;
        const info = await this.enriquecerDisciplina(item.turmaId, item.disciplinaId);
        return { ...item, ...info, status, mediaFinal };
      })
    );
    return resultado.filter((item) => item.status !== "CURSANDO");
  }

  async buscarStatusDoAlunoNaDisciplina(
    alunoId: IdAluno,
    turmaId: IdTurma,
    disciplinaId: IdDisciplina
  ): Promise<StatusDisciplinaAluno> {
    const boletim = await this.boletimRepository.buscarPorAlunoTurmaDisciplina(alunoId, turmaId, disciplinaId);
    return boletim?.obterStatus() ?? "CURSANDO";
  }

  async buscarNotasDoAlunoNaDisciplina(alunoId: IdAluno, turmaId: IdTurma, disciplinaId: IdDisciplina) {
    const boletim = await this.boletimRepository.buscarPorAlunoTurmaDisciplina(alunoId, turmaId, disciplinaId);
    if (!boletim) {
      return { p1: null, p2: null, p3: null, mediaInicial: null, mediaFinal: null, status: "CURSANDO" };
    }

    const notas = boletim.obterNotas();
    return {
      p1: notas.p1 ?? null,
      p2: notas.p2 ?? null,
      p3: notas.p3 ?? null,
      mediaInicial: notas.p1 !== undefined && notas.p2 !== undefined ? boletim.calcularMediaInicial() : null,
      mediaFinal: boletim.calcularMediaFinal(),
      status: boletim.obterStatus()
    };
  }

  async buscarGraficoMediaDisciplinaTurma(alunoId: IdAluno, turmaId: IdTurma, disciplinaId: IdDisciplina) {
    const boletimAluno = await this.boletimRepository.buscarPorAlunoTurmaDisciplina(alunoId, turmaId, disciplinaId);
    const boletinsTurma = await this.boletimRepository.buscarPorTurmaDisciplina(turmaId, disciplinaId);
    const mediasFinais = boletinsTurma
      .map((item) => item.calcularMediaFinal())
      .filter((item): item is number => item !== null);
    const mediaTurma =
      mediasFinais.length === 0 ? null : Number((mediasFinais.reduce((a, b) => a + b, 0) / mediasFinais.length).toFixed(2));

    return {
      alunoMediaFinal: boletimAluno?.calcularMediaFinal() ?? null,
      mediaTurma,
      pontosTurma: mediasFinais
    };
  }

  async buscarAlunosElegiveisParaP3(turmaId: IdTurma, disciplinaId: IdDisciplina): Promise<IdAluno[]> {
    const boletins = await this.boletimRepository.buscarPorTurmaDisciplina(turmaId, disciplinaId);
    return boletins.filter((item) => item.estaElegivelParaP3()).map((item) => item.alunoId);
  }
}
