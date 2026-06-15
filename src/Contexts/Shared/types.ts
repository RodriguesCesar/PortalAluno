export type IdCurso = string;
export type IdTurma = string;
export type IdDisciplina = string;
export type IdAluno = string;
export type IdProfessor = string;

export type TentativaAvaliacao = "P1" | "P2" | "P3";
export type StatusDisciplinaAluno = "CURSANDO" | "APROVADO" | "REPROVADO";

export const NOTA_MINIMA_APROVACAO = 6;

export function validarValorNota(nota: number): void {
  if (Number.isNaN(nota) || nota < 0 || nota > 10) {
    throw new Error("Nota deve estar entre 0 e 10");
  }
}
