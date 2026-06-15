import { Collection, Db, Document } from "mongodb";
import { IdAluno, IdDisciplina, IdTurma, StatusDisciplinaAluno } from "../../Shared/types";
import { BoletimDisciplina } from "../domain/BoletimDisciplina";
import { IBoletimDisciplinaRepository } from "../domain/IBoletimDisciplinaRepository";

interface BoletimDocument {
  alunoId: IdAluno;
  turmaId: IdTurma;
  disciplinaId: IdDisciplina;
  notas: { p1?: number; p2?: number; p3?: number };
  status: StatusDisciplinaAluno;
}

export class MongoBoletimDisciplinaRepository implements IBoletimDisciplinaRepository {
  constructor(private readonly db: Db) {}

  private get collection(): Collection<Document> {
    return this.db.collection("boletins_disciplinas");
  }

  private docToEntity(doc: BoletimDocument): BoletimDisciplina {
    return new BoletimDisciplina(doc.alunoId, doc.turmaId, doc.disciplinaId, doc.notas, doc.status);
  }

  private entityToDoc(boletim: BoletimDisciplina): { _id: string } & BoletimDocument {
    return {
      _id: `${boletim.alunoId}:${boletim.turmaId}:${boletim.disciplinaId}`,
      alunoId: boletim.alunoId,
      turmaId: boletim.turmaId,
      disciplinaId: boletim.disciplinaId,
      notas: boletim.obterNotas(),
      status: boletim.obterStatus()
    };
  }

  async salvar(boletim: BoletimDisciplina): Promise<void> {
    const doc = this.entityToDoc(boletim);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.collection.replaceOne({ _id: doc._id } as any, doc, { upsert: true });
  }

  async buscarPorAlunoTurmaDisciplina(
    alunoId: IdAluno,
    turmaId: IdTurma,
    disciplinaId: IdDisciplina
  ): Promise<BoletimDisciplina | null> {
    const doc = await this.collection.findOne({ alunoId, turmaId, disciplinaId });
    return doc ? this.docToEntity(doc as unknown as BoletimDocument) : null;
  }

  async buscarPorTurmaDisciplina(turmaId: IdTurma, disciplinaId: IdDisciplina): Promise<BoletimDisciplina[]> {
    const docs = await this.collection.find({ turmaId, disciplinaId }).toArray();
    return docs.map((doc) => this.docToEntity(doc as unknown as BoletimDocument));
  }

  async buscarPorAluno(alunoId: IdAluno): Promise<BoletimDisciplina[]> {
    const docs = await this.collection.find({ alunoId }).toArray();
    return docs.map((doc) => this.docToEntity(doc as unknown as BoletimDocument));
  }
}
