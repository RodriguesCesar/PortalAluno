/* eslint-disable no-undef */
const dbName = "portal_notas";
const dbPortal = db.getSiblingDB(dbName);

const now = new Date();

// Senhas (todas usam "123456", exceto cesar.sousa que usa "123")
// Para gerar novos hashes: node -e "require('bcryptjs').hash('123456',10).then(console.log)"
const HASH_123456_1 = "$2b$10$7PNMVRScluDJi2P9NiCCGe3xX2tieBQKtG0jsD.23Q2dfj6WUFWzy";
const HASH_123456_2 = "$2b$10$NkNj7PcfcoN5/g9xnUyRVeWRjea0bvJ0Bd5KMP/qdAjZYmBdfAAuq";
const HASH_123456_3 = "$2b$10$gqnq2YUJGnkBHFSxp6G1.eHTXMACg801FNaj7/WBJhdyqxelPLaZK";
const HASH_123456_4 = "$2b$10$wRWQlJ.322DHjB41wuV3yOjjgSagjYjjOeLB00NerbpfWPVLusDPC";
const HASH_123456_5 = "$2b$10$rWHqSTWDGtqNyvhNdo.EFuQFl4JPHUhacIjQDbSWJgaxbPptbAA9G";
const HASH_123       = "$2b$10$PA4Yq0I19WhlBLC7DgTk9OAaTzAaRYoWrxHH6CsWpJmxjkg9ltSEu";

const usuarios = [
  {
    _id: "usr-aluno-1",
    perfil: "ALUNO",
    email: "cesar.sousa@gmail.com",
    credenciais: { login: "cesar.sousa", senhaHash: HASH_123456_1 },
    referenceId: "aluno-1",
    ativo: true,
    createdAt: now
  },
  {
    _id: "usr-aluno-2",
    perfil: "ALUNO",
    email: "bruno.costa@portalnotas.edu.br",
    credenciais: { login: "bruno.costa", senhaHash: HASH_123456_2 },
    referenceId: "aluno-2",
    ativo: true,
    createdAt: now
  },
  {
    _id: "usr-aluno-3",
    perfil: "ALUNO",
    email: "carla.lima@portalnotas.edu.br",
    credenciais: { login: "carla.lima", senhaHash: HASH_123456_3 },
    referenceId: "aluno-3",
    ativo: true,
    createdAt: now
  },
  {
    _id: "usr-prof-1",
    perfil: "PROFESSOR",
    email: "jose.santos@portalnotas.edu.br",
    credenciais: { login: "jose.santos", senhaHash: HASH_123456_4 },
    referenceId: "prof-1",
    ativo: true,
    createdAt: now
  },
  {
    _id: "usr-prof-2",
    perfil: "PROFESSOR",
    email: "maria.ferreira@portalnotas.edu.br",
    credenciais: { login: "maria.ferreira", senhaHash: HASH_123456_5 },
    referenceId: "prof-2",
    ativo: true,
    createdAt: now
  },
  // Usuário de teste
  {
    _id: "usr-aluno-teste",
    perfil: "ALUNO",
    email: "cesar.sousa@gmail.com",
    credenciais: { login: "cesar.sousa", senhaHash: HASH_123 },
    referenceId: "aluno-1",
    ativo: true,
    createdAt: now
  }
];

const alunos = [
  { _id: "aluno-1", nome: "Cesar Sousa", idade = 38,  ra: "2026001", usuarioId: "usr-aluno-1", createdAt: now },
  { _id: "aluno-2", nome: "Bruno Costa",idade = 27, ra: "2026002", usuarioId: "usr-aluno-2", createdAt: now },
  { _id: "aluno-3", nome: "Carla Lima", idade = 37, ra: "2026003", usuarioId: "usr-aluno-3", createdAt: now }
];

const professores = [
  { _id: "prof-1", nome: "Jose Santos", idade = 50, usuarioId: "usr-prof-1", createdAt: now },
  { _id: "prof-2", nome: "Maria Ferreira", idade = 50, usuarioId: "usr-prof-2", createdAt: now }
];

const cursos = [
  { _id: "curso-ads", nome: "Analise e Desenvolvimento de Sistemas", codigo: "ADS", createdAt: now },
  { _id: "curso-si", nome: "Sistemas de Informacao", codigo: "SI", createdAt: now }
];

const turmas = [
  { _id: "turma-ads-2026-1", cursoId: "curso-ads", periodoLetivo: "2026-1", nome: "ADS 2026/1", createdAt: now },
  { _id: "turma-si-2026-1", cursoId: "curso-si", periodoLetivo: "2026-1", nome: "SI 2026/1", createdAt: now }
];

const disciplinasDoCurso = [
  { _id: "grade-ads-poo", cursoId: "curso-ads", disciplinaId: "disc-poo", disciplinaNome: "POO", cargaHoraria: 80 },
  { _id: "grade-ads-bd", cursoId: "curso-ads", disciplinaId: "disc-bd", disciplinaNome: "Banco de Dados", cargaHoraria: 80 },
  { _id: "grade-si-alg", cursoId: "curso-si", disciplinaId: "disc-alg", disciplinaNome: "Algoritmos", cargaHoraria: 80 }
];

const alunosMatriculados = [
  {
    _id: "mat-1",
    id: "mat-1",
    alunoId: "aluno-1",
    cursoId: "curso-ads",
    turmaId: "turma-ads-2026-1",
    periodoLetivo: "2026-1",
    createdAt: now
  },
  {
    _id: "mat-2",
    id: "mat-2",
    alunoId: "aluno-2",
    cursoId: "curso-ads",
    turmaId: "turma-ads-2026-1",
    periodoLetivo: "2026-1",
    createdAt: now
  },
  {
    _id: "mat-3",
    id: "mat-3",
    alunoId: "aluno-3",
    cursoId: "curso-si",
    turmaId: "turma-si-2026-1",
    periodoLetivo: "2026-1",
    createdAt: now
  }
];

const matriculasDisciplinas = [
  { _id: "md-1", id: "md-1", alunoMatriculadoId: "mat-1", disciplinaId: "disc-poo", createdAt: now },
  { _id: "md-2", id: "md-2", alunoMatriculadoId: "mat-1", disciplinaId: "disc-bd", createdAt: now },
  { _id: "md-3", id: "md-3", alunoMatriculadoId: "mat-2", disciplinaId: "disc-poo", createdAt: now },
  { _id: "md-4", id: "md-4", alunoMatriculadoId: "mat-2", disciplinaId: "disc-bd", createdAt: now },
  { _id: "md-5", id: "md-5", alunoMatriculadoId: "mat-3", disciplinaId: "disc-alg", createdAt: now }
];

const boletinsDisciplinas = [
  {
    _id: "aluno-1:turma-ads-2026-1:disc-poo",
    alunoId: "aluno-1",
    turmaId: "turma-ads-2026-1",
    disciplinaId: "disc-poo",
    notas: { p1: 4.0, p2: 5.0, p3: 7.0 },
    mediaInicial: 4.5,
    mediaFinal: 6.0,
    status: "APROVADO",
    createdAt: now
  },
  {
    _id: "aluno-2:turma-ads-2026-1:disc-poo",
    alunoId: "aluno-2",
    turmaId: "turma-ads-2026-1",
    disciplinaId: "disc-poo",
    notas: { p1: 8.0, p2: 7.0 },
    mediaInicial: 7.5,
    mediaFinal: 7.5,
    status: "APROVADO",
    createdAt: now
  },
  {
    _id: "aluno-1:turma-ads-2026-1:disc-bd",
    alunoId: "aluno-1",
    turmaId: "turma-ads-2026-1",
    disciplinaId: "disc-bd",
    notas: { p1: 5.0, p2: 4.0 },
    mediaInicial: 4.5,
    mediaFinal: null,
    status: "CURSANDO",
    createdAt: now
  },
  {
    _id: "aluno-2:turma-ads-2026-1:disc-bd",
    alunoId: "aluno-2",
    turmaId: "turma-ads-2026-1",
    disciplinaId: "disc-bd",
    notas: { p1: 6.5, p2: 6.0 },
    mediaInicial: 6.25,
    mediaFinal: 6.25,
    status: "APROVADO",
    createdAt: now
  },
  {
    _id: "aluno-3:turma-si-2026-1:disc-alg",
    alunoId: "aluno-3",
    turmaId: "turma-si-2026-1",
    disciplinaId: "disc-alg",
    notas: { p1: 3.5, p2: 4.5 },
    mediaInicial: 4.0,
    mediaFinal: null,
    status: "CURSANDO",
    createdAt: now
  }
];

const vinculosDocentes = [
  {
    _id: "vin-1",
    id: "vin-1",
    professorId: "prof-1",
    cursoId: "curso-ads",
    turmaId: "turma-ads-2026-1",
    disciplinaId: "disc-poo",
    createdAt: now
  },
  {
    _id: "vin-2",
    id: "vin-2",
    professorId: "prof-2",
    cursoId: "curso-ads",
    turmaId: "turma-ads-2026-1",
    disciplinaId: "disc-bd",
    createdAt: now
  },
  {
    _id: "vin-3",
    id: "vin-3",
    professorId: "prof-1",
    cursoId: "curso-si",
    turmaId: "turma-si-2026-1",
    disciplinaId: "disc-alg",
    createdAt: now
  }
];

const collections = [
  "usuarios",
  "alunos",
  "professores",
  "cursos",
  "turmas",
  "disciplinas_do_curso",
  "alunos_matriculados",
  "matriculas_disciplinas",
  "boletins_disciplinas",
  "vinculos_docentes"
];

collections.forEach((name) => dbPortal.getCollection(name).deleteMany({}));

dbPortal.usuarios.insertMany(usuarios);
dbPortal.alunos.insertMany(alunos);
dbPortal.professores.insertMany(professores);
dbPortal.cursos.insertMany(cursos);
dbPortal.turmas.insertMany(turmas);
dbPortal.disciplinas_do_curso.insertMany(disciplinasDoCurso);
dbPortal.alunos_matriculados.insertMany(alunosMatriculados);
dbPortal.matriculas_disciplinas.insertMany(matriculasDisciplinas);
dbPortal.boletins_disciplinas.insertMany(boletinsDisciplinas);
dbPortal.vinculos_docentes.insertMany(vinculosDocentes);

print(`Seed concluido no banco ${dbName}.`);
print("Colecoes carregadas: " + collections.join(", "));
