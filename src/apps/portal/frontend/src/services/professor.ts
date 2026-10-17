import { request, requestJson } from './http';

export type VinculoDocente = {
  vinculoId: string;
  curso: string;
  turma: string;
  turmaId: string;
  disciplina: string;
  disciplinaId: string;
};

export type AlunoVinculo = {
  alunoId: string;
  nome: string;
  p1?: number;
  p2?: number;
  p3?: number;
  mediaFinal?: number;
  status: 'CURSANDO' | 'APROVADO' | 'REPROVADO';
};

export type AlunoElegivel = {
  alunoId: string;
  nome: string;
  p1?: number;
  p2?: number;
  mediaFinal?: number;
  status: string;
};

export type LancarNotaPayload = {
  alunoId: string;
  turmaId: string;
  disciplinaId: string;
  nota: number;
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

const post = (url: string, body: Record<string, unknown>, headers: Headers, fallbackMessage: string): Promise<Response> =>
  request(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    },
    fallbackMessage
  );

export const getVinculos = async (professorId: string, headers: Headers = {}): Promise<VinculoDocente[]> =>
  getJson<VinculoDocente[]>(
    `${API_URL}/professores/${professorId}/vinculos`,
    headers,
    'Não foi possível carregar os vínculos do professor.'
  );

export const getAlunosPorVinculo = async (
  professorId: string,
  vinculoId: string,
  headers: Headers = {}
): Promise<AlunoVinculo[]> =>
  getJson<AlunoVinculo[]>(
    `${API_URL}/professores/${professorId}/vinculos/${vinculoId}/alunos`,
    headers,
    'Não foi possível carregar os alunos do vínculo.'
  );

export const getAlunosElegiveisP3 = async (
  professorId: string,
  vinculoId: string,
  headers: Headers = {}
): Promise<AlunoElegivel[]> =>
  getJson<AlunoElegivel[]>(
    `${API_URL}/professores/${professorId}/vinculos/${vinculoId}/alunos-elegiveis-p3`,
    headers,
    'Não foi possível carregar os alunos elegíveis para P3.'
  );

export const registrarNotaP1 = async (
  professorId: string,
  payload: LancarNotaPayload,
  headers: Headers = {}
): Promise<Response> =>
  post(
    `${API_URL}/professores/${professorId}/notas/p1`,
    payload,
    headers,
    'Não foi possível registrar a nota P1.'
  );

export const registrarNotaP2 = async (
  professorId: string,
  payload: LancarNotaPayload,
  headers: Headers = {}
): Promise<Response> =>
  post(
    `${API_URL}/professores/${professorId}/notas/p2`,
    payload,
    headers,
    'Não foi possível registrar a nota P2.'
  );

export const registrarNotaP3 = async (
  professorId: string,
  payload: LancarNotaPayload,
  headers: Headers = {}
): Promise<Response> =>
  post(
    `${API_URL}/professores/${professorId}/notas/p3`,
    payload,
    headers,
    'Não foi possível registrar a nota P3.'
  );
