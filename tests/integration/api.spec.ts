import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { MongoClient } from "mongodb";
import request from "supertest";
import { createProductionApp } from "../../src/apps/portal/backend/app";

let app: Awaited<ReturnType<typeof createProductionApp>>["app"];
let shutdown: (() => Promise<void>) | null = null;

before(async () => {
  const mongoUri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/portal_notas";
  const [dbName] = mongoUri.split("/").reverse();
  const mongo = new MongoClient(mongoUri);
  await mongo.connect();
  const db = mongo.db(dbName);
  const alunosMatriculados = db.collection<any>("alunos_matriculados");
  const matriculasDisciplinas = db.collection<any>("matriculas_disciplinas");
  const vinculosDocentes = db.collection<any>("vinculos_docentes");
  const boletins = db.collection<any>("boletins_disciplinas");

  await alunosMatriculados.deleteMany({});
  await matriculasDisciplinas.deleteMany({});
  await vinculosDocentes.deleteMany({});
  await boletins.deleteMany({});

  await alunosMatriculados.insertMany([
    { _id: "mat-1", id: "mat-1", alunoId: "aluno-1", cursoId: "curso-1", turmaId: "turma-1", periodoLetivo: "2026-1" },
    { _id: "mat-2", id: "mat-2", alunoId: "aluno-2", cursoId: "curso-1", turmaId: "turma-1", periodoLetivo: "2026-1" }
  ]);
  await matriculasDisciplinas.insertMany([
    { _id: "md-1", id: "md-1", alunoMatriculadoId: "mat-1", disciplinaId: "disc-1" },
    { _id: "md-2", id: "md-2", alunoMatriculadoId: "mat-2", disciplinaId: "disc-1" }
  ]);
  await vinculosDocentes.insertMany([
    {
      _id: "vin-1",
      id: "vin-1",
      professorId: "prof-1",
      cursoId: "curso-1",
      turmaId: "turma-1",
      disciplinaId: "disc-1"
    }
  ]);
  await boletins.insertMany([
    {
      _id: "aluno-1:turma-1:disc-1",
      alunoId: "aluno-1",
      turmaId: "turma-1",
      disciplinaId: "disc-1",
      notas: { p1: 4, p2: 5 },
      status: "CURSANDO"
    },
    {
      _id: "aluno-2:turma-1:disc-1",
      alunoId: "aluno-2",
      turmaId: "turma-1",
      disciplinaId: "disc-1",
      notas: { p1: 8, p2: 7 },
      status: "CURSANDO"
    }
  ]);

  await mongo.close();

  const production = await createProductionApp();
  app = production.app;
  shutdown = production.shutdown;
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
});

after(async () => {
  await shutdown?.();
});

test("deve retornar vínculos do professor", async () => {
  const response = await request(app).get("/professores/prof-1/vinculos");
  assert.equal(response.status, 200);
  assert.equal(response.body.length, 1);
});

test("deve listar alunos elegíveis para P3", async () => {
  const response = await request(app).get("/professores/prof-1/vinculos/vin-1/alunos-elegiveis-p3");
  assert.equal(response.status, 200);
  assert.equal(response.body.includes("aluno-1"), true);
});

test("deve registrar P3 e atualizar notas do aluno", async () => {
  const registerResponse = await request(app).post("/professores/prof-1/notas/p3").send({
    alunoId: "aluno-1",
    turmaId: "turma-1",
    disciplinaId: "disc-1",
    nota: 7
  });
  assert.equal(registerResponse.status, 204);

  const notasResponse = await request(app).get("/alunos/aluno-1/disciplinas/disc-1/notas?turmaId=turma-1");
  assert.equal(notasResponse.status, 200);
  assert.equal(notasResponse.body.status, "APROVADO");
  assert.equal(notasResponse.body.mediaFinal, 6);
});
