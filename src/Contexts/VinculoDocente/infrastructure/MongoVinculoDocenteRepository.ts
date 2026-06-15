import { Collection, Db, Document } from "mongodb";
import { IdDisciplina, IdProfessor, IdTurma } from "../../Shared/types";
import { VinculoDocente } from "../domain/VinculoDocente";
import { IVinculoDocenteRepository } from "../domain/IVinculoDocenteRepository";

export class MongoVinculoDocenteRepository implements IVinculoDocenteRepository {
  constructor(private readonly db: Db) {}

  private get collection(): Collection<Document> {
    return this.db.collection("vinculos_docentes");
  }

  async salvar(vinculo: VinculoDocente): Promise<void> {
    await this.collection.replaceOne(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { _id: vinculo.id } as any,
      { _id: vinculo.id, ...vinculo },
      { upsert: true }
    );
  }

  async buscarPorProfessor(professorId: IdProfessor): Promise<VinculoDocente[]> {
    const docs = await this.collection.find({ professorId }).toArray();
    return docs as unknown as VinculoDocente[];
  }

  async buscarPorId(vinculoId: string): Promise<VinculoDocente | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await this.collection.findOne({ _id: vinculoId } as any);
    return doc ? (doc as unknown as VinculoDocente) : null;
  }

  async existe(professorId: IdProfessor, turmaId: IdTurma, disciplinaId: IdDisciplina): Promise<boolean> {
    const count = await this.collection.countDocuments({ professorId, turmaId, disciplinaId });
    return count > 0;
  }
}
