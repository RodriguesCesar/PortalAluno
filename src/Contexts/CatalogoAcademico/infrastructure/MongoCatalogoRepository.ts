import { Collection, Db, Document } from "mongodb";
import { IdCurso, IdDisciplina, IdTurma } from "../../Shared/types";
import { CursoInfo, DisciplinaInfo, ICatalogoRepository, TurmaInfo } from "../domain/ICatalogoRepository";

export class MongoCatalogoRepository implements ICatalogoRepository {
  constructor(private readonly db: Db) {}

  private get turmasCollection(): Collection<Document> {
    return this.db.collection("turmas");
  }

  private get cursosCollection(): Collection<Document> {
    return this.db.collection("cursos");
  }

  private get disciplinasCollection(): Collection<Document> {
    return this.db.collection("disciplinas_do_curso");
  }

  async buscarTurma(turmaId: IdTurma): Promise<TurmaInfo | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await this.turmasCollection.findOne({ _id: turmaId } as any);
    if (!doc) return null;
    return { nome: doc["nome"] as string, cursoId: doc["cursoId"] as IdCurso };
  }

  async buscarCurso(cursoId: IdCurso): Promise<CursoInfo | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await this.cursosCollection.findOne({ _id: cursoId } as any);
    if (!doc) return null;
    return { nome: doc["nome"] as string };
  }

  async buscarDisciplinaEmCurso(cursoId: IdCurso, disciplinaId: IdDisciplina): Promise<DisciplinaInfo | null> {
    const doc = await this.disciplinasCollection.findOne({ cursoId, disciplinaId });
    if (!doc) return null;
    return { nome: doc["disciplinaNome"] as string };
  }
}
