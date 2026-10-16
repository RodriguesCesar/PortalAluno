import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import request from "supertest";
import { createProductionApp } from "../../src/apps/portal/backend/app";

let app: Awaited<ReturnType<typeof createProductionApp>>["app"];
let shutdown: (() => Promise<void>) | null = null;

let aluno1Token = "";
let aluno2Token = "";
let professor1Token = "";
let professor2Token = "";

function authHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

async function loginAs(email: string, senha: string): Promise<string> {
  const response = await request(app).post("/auth/login").send({ email, senha });
  assert.equal(response.status, 200);
  assert.equal(typeof response.body.token, "string");
  return response.body.token as string;
}

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
  const usuarios = db.collection<any>("usuarios");

  await alunosMatriculados.deleteMany({});
  await matriculasDisciplinas.deleteMany({});
  await vinculosDocentes.deleteMany({});
  await boletins.deleteMany({});
  await usuarios.deleteMany({});

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

  const senhaHash = await bcrypt.hash("123456", 10);
  await usuarios.insertMany([
    {
      _id: "usr-aluno-1",
      email: "aluno1@portal.dev",
      perfil: "ALUNO",
      referenceId: "aluno-1",
      credenciais: { login: "aluno1@portal.dev", senhaHash }
    },
    {
      _id: "usr-aluno-2",
      email: "aluno2@portal.dev",
      perfil: "ALUNO",
      referenceId: "aluno-2",
      credenciais: { login: "aluno2@portal.dev", senhaHash }
    },
    {
      _id: "usr-prof-1",
      email: "prof1@portal.dev",
      perfil: "PROFESSOR",
      referenceId: "prof-1",
      credenciais: { login: "prof1@portal.dev", senhaHash }
    },
    {
      _id: "usr-prof-2",
      email: "prof2@portal.dev",
      perfil: "PROFESSOR",
      referenceId: "prof-2",
      credenciais: { login: "prof2@portal.dev", senhaHash }
    }
  ]);

  await mongo.close();

  const production = await createProductionApp();
  app = production.app;
  shutdown = production.shutdown;

  const healthResponse = await request(app).get("/health");
  assert.equal(healthResponse.status, 200);

  aluno1Token = await loginAs("aluno1@portal.dev", "123456");
  aluno2Token = await loginAs("aluno2@portal.dev", "123456");
  professor1Token = await loginAs("prof1@portal.dev", "123456");
  professor2Token = await loginAs("prof2@portal.dev", "123456");
});

after(async () => {
  await shutdown?.();
});

test("deve bloquear rota protegida sem token", async () => {
  const response = await request(app).get("/professores/prof-1/vinculos");
  assert.equal(response.status, 401);
});

test("deve retornar vínculos do professor autenticado no próprio recurso", async () => {
  const response = await request(app)
    .get("/professores/prof-1/vinculos")
    .set(authHeader(professor1Token));

  assert.equal(response.status, 200);
  assert.equal(response.body.length, 1);
});

test("deve retornar 403 quando professor acessa recurso de outro professor", async () => {
  const response = await request(app)
    .get("/professores/prof-1/vinculos")
    .set(authHeader(professor2Token));

  assert.equal(response.status, 403);
});

test("deve listar alunos elegíveis para P3 para professor dono do vínculo", async () => {
  const response = await request(app)
    .get("/professores/prof-1/vinculos/vin-1/alunos-elegiveis-p3")
    .set(authHeader(professor1Token));

  assert.equal(response.status, 200);
  assert.equal(response.body.includes("aluno-1"), true);
});

test("deve registrar P3 e atualizar notas do aluno autenticado no próprio recurso", async () => {
  const registerResponse = await request(app)
    .post("/professores/prof-1/notas/p3")
    .set(authHeader(professor1Token))
    .send({
      alunoId: "aluno-1",
      turmaId: "turma-1",
      disciplinaId: "disc-1",
      nota: 7
    });

  assert.equal(registerResponse.status, 204);

  const notasResponse = await request(app)
    .get("/alunos/aluno-1/disciplinas/disc-1/notas?turmaId=turma-1")
    .set(authHeader(aluno1Token));

  assert.equal(notasResponse.status, 200);
  assert.equal(notasResponse.body.status, "APROVADO");
  assert.equal(notasResponse.body.mediaFinal, 6);
});

test("deve retornar 403 quando aluno acessa notas de outro aluno", async () => {
  const response = await request(app)
    .get("/alunos/aluno-1/disciplinas/disc-1/notas?turmaId=turma-1")
    .set(authHeader(aluno2Token));

  assert.equal(response.status, 403);
});

test("deve retornar 400 quando turmaId não é informado em notas", async () => {
  const response = await request(app)
    .get("/alunos/aluno-1/disciplinas/disc-1/notas")
    .set(authHeader(aluno1Token));

  assert.equal(response.status, 400);
});

test("deve retornar 400 quando turmaId não é informado em situação", async () => {
  const response = await request(app)
    .get("/alunos/aluno-1/disciplinas/disc-1/situacao")
    .set(authHeader(aluno1Token));

  assert.equal(response.status, 400);
});

test("deve retornar 400 quando payload de nota é inválido", async () => {
  const response = await request(app)
    .post("/professores/prof-1/notas/p1")
    .set(authHeader(professor1Token))
    .send({
      alunoId: "aluno-1",
      turmaId: "turma-1",
      disciplinaId: "disc-1",
      nota: 12
    });

  assert.equal(response.status, 400);
});
