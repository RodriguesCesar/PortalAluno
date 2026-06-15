import { Db } from "mongodb";

export async function ensureIndexes(db: Db): Promise<void> {
  await db.collection("alunos_matriculados").createIndex(
    { alunoId: 1, periodoLetivo: 1 },
    { background: true }
  );

  await db.collection("matriculas_disciplinas").createIndex(
    { alunoMatriculadoId: 1, disciplinaId: 1 },
    { unique: true, background: true }
  );

  await db.collection("boletins_disciplinas").createIndex(
    { turmaId: 1, disciplinaId: 1, alunoId: 1 },
    { background: true }
  );

  await db.collection("vinculos_docentes").createIndex(
    { professorId: 1, cursoId: 1, turmaId: 1, disciplinaId: 1 },
    { unique: true, background: true }
  );
}
