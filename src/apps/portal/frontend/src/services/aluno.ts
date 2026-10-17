import { requestJson } from './http';

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

const getJson = <T>(url: string, headers: Headers, fallbackMessage: string): Promise<T> =>
  requestJson<T>(
    url,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...headers },
    },
    fallbackMessage
  );

export const getDisciplinasAtuais = async (alunoId: string, headers: Headers = {}): Promise<DisciplinaAtual[]> =>
  getJson<DisciplinaAtual[]>(
    `${API_URL}/alunos/${alunoId}/disciplinas/atuais`,
    headers,
    'Não foi possível carregar as disciplinas atuais.'
  );

export const getDisciplinasConcluidaas = async (alunoId: string, headers: Headers = {}): Promise<DisciplinaConcluida[]> =>
  getJson<DisciplinaConcluida[]>(
    `${API_URL}/alunos/${alunoId}/disciplinas/concluidas`,
    headers,
    'Não foi possível carregar as disciplinas concluídas.'
  );

export const getNotas = async (alunoId: string, disciplinaId: string, turmaId: string, headers: Headers = {}): Promise<Notas> =>
  getJson<Notas>(
    `${API_URL}/alunos/${alunoId}/disciplinas/${disciplinaId}/notas?turmaId=${turmaId}`,
    headers,
    'Não foi possível carregar as notas da disciplina.'
  );

export const getStatusDisciplina = async (
  alunoId: string,
  disciplinaId: string,
  turmaId: string,
  headers: Headers = {}
): Promise<{ status: Status }> =>
  getJson<{ status: Status }>(
    `${API_URL}/alunos/${alunoId}/disciplinas/${disciplinaId}/situacao?turmaId=${turmaId}`,
    headers,
    'Não foi possível carregar a situação da disciplina.'
  );

export const getGraficoMedia = async (
  alunoId: string,
  turmaId: string,
  disciplinaId: string,
  headers: Headers = {}
): Promise<GraficoData> =>
  getJson<GraficoData>(
    `${API_URL}/alunos/${alunoId}/turmas/${turmaId}/disciplinas/${disciplinaId}/grafico-media`,
    headers,
    'Não foi possível carregar o gráfico de média.'
  );
