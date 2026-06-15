import { randomUUID } from "node:crypto";
import { IBoletimDisciplinaRepository } from "../../domain/IBoletimDisciplinaRepository";
import { DomainError } from "../../../Shared/DomainError";
import { IEventBus } from "../../../Shared/IEventBus";
import { IdAluno, IdDisciplina, IdProfessor, IdTurma, TentativaAvaliacao } from "../../../Shared/types";
import { IMatriculasRepository } from "../../../Matriculas/domain/IMatriculasRepository";
import { IVinculoDocenteRepository } from "../../../VinculoDocente/domain/IVinculoDocenteRepository";
import { BoletimDisciplina } from "../../domain/BoletimDisciplina";

export interface RegistrarNotaCommand {
  professorId: IdProfessor;
  alunoId: IdAluno;
  turmaId: IdTurma;
  disciplinaId: IdDisciplina;
  nota: number;
}

export class RegistrarNotaCommandHandler {
  constructor(
    private readonly boletimRepository: IBoletimDisciplinaRepository,
    private readonly matriculasRepository: IMatriculasRepository,
    private readonly vinculoDocenteRepository: IVinculoDocenteRepository,
    private readonly eventBus: IEventBus
  ) {}

  async registrarP1(command: RegistrarNotaCommand): Promise<void> {
    await this.registrarNota("P1", command);
  }

  async registrarP2(command: RegistrarNotaCommand): Promise<void> {
    await this.registrarNota("P2", command);
  }

  async registrarP3(command: RegistrarNotaCommand): Promise<void> {
    await this.registrarNota("P3", command);
  }

  async fecharAvaliacao(command: Omit<RegistrarNotaCommand, "nota">): Promise<void> {
    const boletim = await this.boletimRepository.buscarPorAlunoTurmaDisciplina(
      command.alunoId,
      command.turmaId,
      command.disciplinaId
    );
    if (!boletim) {
      throw new DomainError("Boletim não encontrado");
    }
    boletim.fecharAvaliacao();
    await this.boletimRepository.salvar(boletim);
  }

  private async registrarNota(tentativa: TentativaAvaliacao, command: RegistrarNotaCommand): Promise<void> {
    const professorAutorizado = await this.vinculoDocenteRepository.existe(
      command.professorId,
      command.turmaId,
      command.disciplinaId
    );
    if (!professorAutorizado) {
      throw new DomainError("Professor sem vínculo para lançar nota nesta disciplina");
    }

    const matricula = await this.matriculasRepository.buscarAlunoMatriculadoPorAlunoTurma(
      command.alunoId,
      command.turmaId
    );
    if (!matricula) {
      throw new DomainError("Aluno não matriculado na turma");
    }

    let boletim = await this.boletimRepository.buscarPorAlunoTurmaDisciplina(
      command.alunoId,
      command.turmaId,
      command.disciplinaId
    );
    if (!boletim) {
      boletim = new BoletimDisciplina(command.alunoId, command.turmaId, command.disciplinaId);
    }

    if (tentativa === "P1") {
      boletim.registrarP1(command.nota);
    }
    if (tentativa === "P2") {
      boletim.registrarP2(command.nota);
    }
    if (tentativa === "P3") {
      boletim.registrarP3(command.nota);
    }

    await this.boletimRepository.salvar(boletim);
    await this.eventBus.publicar({
      name: `Nota${tentativa}Registrada`,
      payload: {
        eventId: randomUUID(),
        alunoId: command.alunoId,
        turmaId: command.turmaId,
        disciplinaId: command.disciplinaId,
        nota: command.nota,
        status: boletim.obterStatus(),
        elegivelP3: boletim.estaElegivelParaP3()
      },
      occurredAt: new Date().toISOString()
    });

    if (boletim.estaElegivelParaP3()) {
      await this.eventBus.publicar({
        name: "AlunoElegivelParaP3",
        payload: {
          eventId: randomUUID(),
          alunoId: command.alunoId,
          turmaId: command.turmaId,
          disciplinaId: command.disciplinaId
        },
        occurredAt: new Date().toISOString()
      });
    }
  }
}
