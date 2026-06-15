import { Collection, Db, Document } from "mongodb";
import { IdAluno, IdDisciplina, IdTurma } from "../../Shared/types";
import { AlunoMatriculado, MatriculaDisciplina } from "../domain/MatriculaModels";
import { IMatriculasRepository } from "../domain/IMatriculasRepository";

export class MongoMatriculasRepository implements IMatriculasRepository {
  constructor(private readonly db: Db) {}

  private get alunosCollection(): Collection<Document> {
    return this.db.collection("alunos_matriculados");
  }

  private get disciplinasCollection(): Collection<Document> {
    return this.db.collection("matriculas_disciplinas");
  }

  async salvarAlunoMatriculado(value: AlunoMatriculado): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.alunosCollection.replaceOne({ _id: value.id } as any, { _id: value.id, ...value }, { upsert: true });
  }

  async salvarMatriculaDisciplina(value: MatriculaDisciplina): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.disciplinasCollection.replaceOne({ _id: value.id } as any, { _id: value.id, ...value }, { upsert: true });
  }

  async buscarAlunoMatriculadoPorAlunoTurma(alunoId: IdAluno, turmaId: IdTurma): Promise<AlunoMatriculado | null> {
    const doc = await this.alunosCollection.findOne({ alunoId, turmaId });
    return doc ? (doc as unknown as AlunoMatriculado) : null;
  }

  async buscarDisciplinasDoAluno(alunoId: IdAluno): Promise<Array<{ turmaId: IdTurma; disciplinaId: IdDisciplina }>> {
    const matriculas = (await this.alunosCollection.find({ alunoId }).toArray()) as unknown as AlunoMatriculado[];
    if (matriculas.length === 0) return [];

    const ids = matriculas.map((m) => m.id);
    const disciplinas = (await this.disciplinasCollection
      .find({ alunoMatriculadoId: { $in: ids } })
      .toArray()) as unknown as MatriculaDisciplina[];

    return disciplinas.map((d) => {
      const matricula = matriculas.find((m) => m.id === d.alunoMatriculadoId);
      if (!matricula) throw new Error("Matrícula inconsistente");
      return { turmaId: matricula.turmaId, disciplinaId: d.disciplinaId };
    });
  }

  async buscarAlunosPorTurmaDisciplina(turmaId: IdTurma, disciplinaId: IdDisciplina): Promise<IdAluno[]> {
    const matriculas = (await this.alunosCollection.find({ turmaId }).toArray()) as unknown as AlunoMatriculado[];
    if (matriculas.length === 0) return [];

    const ids = matriculas.map((m) => m.id);
    const disciplinas = (await this.disciplinasCollection
      .find({ alunoMatriculadoId: { $in: ids }, disciplinaId })
      .toArray()) as unknown as MatriculaDisciplina[];

    const alunosIds = disciplinas.map((d) => {
      const matricula = matriculas.find((m) => m.id === d.alunoMatriculadoId);
      if (!matricula) throw new Error("Matrícula inconsistente");
      return matricula.alunoId;
    });

    return [...new Set(alunosIds)];
  }
}
