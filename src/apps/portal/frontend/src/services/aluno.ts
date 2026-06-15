export type Status = 'CURSANDO' | 'APROVADO' | 'REPROVADO';

export type DisciplinaAtual = {
  disciplinaId: string;
  nome: string;
  curso: string;
  turma: string;
  turmaId: string;
  status: Status;
};

export type DisciplinaConcluida = {
  disciplinaId: string;
  nome: string;
  curso: string;
  turma: string;
  turmaId: string;
  mediaFinal: number | null;
  status: 'APROVADO' | 'REPROVADO' | 'CURSANDO';
};

export type Notas = {
  p1?: number;
  p2?: number;
  p3?: number;
  mediaFinal?: number;
};

export type GraficoData = {
  mediaAluno: number;
  mediaTurma: number;
};

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

type Headers = Record<string, string>;

const get = async (url: string, headers: Headers = {}) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', ...headers } });

export const getDisciplinasAtuais = async (alunoId: string, headers: Headers = {}): Promise<DisciplinaAtual[]> => {
  const res = await get(`${API_URL}/alunos/${alunoId}/disciplinas/atuais`, headers);
  return res.json();
};

export const getDisciplinasConcluidaas = async (alunoId: string, headers: Headers = {}): Promise<DisciplinaConcluida[]> => {
  const res = await get(`${API_URL}/alunos/${alunoId}/disciplinas/concluidas`, headers);
  return res.json();
};

export const getNotas = async (alunoId: string, disciplinaId: string, turmaId: string, headers: Headers = {}): Promise<Notas> => {
  const res = await get(`${API_URL}/alunos/${alunoId}/disciplinas/${disciplinaId}/notas?turmaId=${turmaId}`, headers);
  return res.json();
};

export const getStatusDisciplina = async (alunoId: string, disciplinaId: string, turmaId: string, headers: Headers = {}): Promise<{ status: Status }> => {
  const res = await get(`${API_URL}/alunos/${alunoId}/disciplinas/${disciplinaId}/situacao?turmaId=${turmaId}`, headers);
  return res.json();
};

export const getGraficoMedia = async (
  alunoId: string,
  turmaId: string,
  disciplinaId: string,
  headers: Headers = {}
): Promise<GraficoData> => {
  const res = await get(
    `${API_URL}/alunos/${alunoId}/turmas/${turmaId}/disciplinas/${disciplinaId}/grafico-media`,
    headers
  );
  return res.json();
};
