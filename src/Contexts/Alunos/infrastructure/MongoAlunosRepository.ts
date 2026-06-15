import { Collection, Db, Document } from "mongodb";
import { IdAluno } from "../../Shared/types";
import { IAlunosRepository } from "../domain/IAlunosRepository";
import { Aluno } from "../domain/AlunoModel";

export class MongoAlunosRepository implements IAlunosRepository {
  constructor(private readonly db: Db) {}

  private get collection(): Collection<Document> {
    return this.db.collection("alunos");
  }

  async buscarPorId(alunoId: IdAluno): Promise<Aluno | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await this.collection.findOne({ _id: alunoId } as any);
    return doc
      ? {
          id: (doc["_id"] as any) as IdAluno,
          nome: doc["nome"] as string,
          idade: doc["idade"] as number,
          ra: doc["ra"] as string,
          usuarioId: doc["usuarioId"] as string,
          createdAt: doc["createdAt"] as Date,
        }
      : null;
  }

  async buscarNomePorId(alunoId: IdAluno): Promise<string | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await this.collection.findOne({ _id: alunoId } as any, { projection: { nome: 1 } });
    return doc ? (doc["nome"] as string) : null;
  }
}

