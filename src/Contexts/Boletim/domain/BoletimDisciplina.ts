import { DomainError } from "../../Shared/DomainError";
import {
  IdAluno,
  IdDisciplina,
  IdTurma,
  NOTA_MINIMA_APROVACAO,
  StatusDisciplinaAluno,
  validarValorNota
} from "../../Shared/types";

type Notas = {
  p1?: number;
  p2?: number;
  p3?: number;
};

export class BoletimDisciplina {
  private readonly notas: Notas;
  private status: StatusDisciplinaAluno;

  constructor(
    public readonly alunoId: IdAluno,
    public readonly turmaId: IdTurma,
    public readonly disciplinaId: IdDisciplina,
    notas: Notas = {},
    status: StatusDisciplinaAluno = "CURSANDO"
  ) {
    this.notas = { ...notas };
    this.status = status;
   
  }

  registrarP1(nota: number): void {
    validarValorNota(nota);
    this.notas.p1 = nota;
    this.recalcularStatus();
  }

  registrarP2(nota: number): void {
    validarValorNota(nota);
    this.notas.p2 = nota;
    this.recalcularStatus();
  }

  registrarP3(nota: number): void {
    validarValorNota(nota);
    if (this.notas.p1 === undefined || this.notas.p2 === undefined) {
      throw new DomainError("P3 só pode ser registrada após P1 e P2");
    }
    if (!this.estaElegivelParaP3()) {
      throw new DomainError("Aluno não está elegível para P3");
    }
    this.notas.p3 = nota;
    this.recalcularStatus();
  }

  fecharAvaliacao(): void {
    if (this.notas.p1 === undefined || this.notas.p2 === undefined) {
      throw new DomainError("Não é possível fechar sem P1 e P2");
    }
    this.recalcularStatus(true);
  }

  obterStatus(): StatusDisciplinaAluno {
    return this.status;
  }

  estaElegivelParaP3(): boolean {
    if (this.notas.p1 === undefined || this.notas.p2 === undefined) {
      return false;
    }
    return this.calcularMediaInicial() < NOTA_MINIMA_APROVACAO && this.notas.p3 === undefined;
  }

  calcularMediaInicial(): number {
    if (this.notas.p1 === undefined || this.notas.p2 === undefined) {
      return 0;
    }
    return Number(((this.notas.p1 + this.notas.p2) / 2).toFixed(2));
  }

  calcularMediaFinal(): number | null {
    if (this.notas.p1 === undefined || this.notas.p2 === undefined) {
      return null;
    }

    if (this.notas.p3 !== undefined) {
      const notaBase = Math.max(this.notas.p1, this.notas.p2);
      return Number(((notaBase + this.notas.p3) / 2).toFixed(2));
    }

    return this.calcularMediaInicial();
  }

  obterNotas(): Notas {
    return { ...this.notas };
  }

  private recalcularStatus(fechamentoForcado = false): void {
    if (this.notas.p1 === undefined || this.notas.p2 === undefined) {
      this.status = "CURSANDO";
      return;
    }

    const mediaInicial = this.calcularMediaInicial();
    if (mediaInicial >= NOTA_MINIMA_APROVACAO && this.notas.p3 === undefined) {
      this.status = fechamentoForcado ? "APROVADO" : "CURSANDO";
      return;
    }

    if (this.notas.p3 === undefined) {
      this.status = "CURSANDO";
      return;
    }

    const mediaFinal = this.calcularMediaFinal();
    if (mediaFinal === null) {
      this.status = "CURSANDO";
      return;
    }

    this.status = mediaFinal >= NOTA_MINIMA_APROVACAO ? "APROVADO" : "REPROVADO";
  }
}
