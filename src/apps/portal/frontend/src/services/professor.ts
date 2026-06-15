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

const get = async (url: string, headers: Headers = {}) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', ...headers } });

const post = async (url: string, body: Record<string, unknown>, headers: Headers = {}) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

export const getVinculos = async (professorId: string, headers: Headers = {}): Promise<VinculoDocente[]> => {
  const res = await get(`${API_URL}/professores/${professorId}/vinculos`, headers);
  return res.json();
};

export const getAlunosPorVinculo = async (
  professorId: string,
  vinculoId: string,
  headers: Headers = {}
): Promise<AlunoVinculo[]> => {
  const res = await get(`${API_URL}/professores/${professorId}/vinculos/${vinculoId}/alunos`, headers);
  return res.json();
};

export const getAlunosElegiveisP3 = async (
  professorId: string,
  vinculoId: string,
  headers: Headers = {}
): Promise<AlunoElegivel[]> => {
  const res = await get(
    `${API_URL}/professores/${professorId}/vinculos/${vinculoId}/alunos-elegiveis-p3`,
    headers
  );
  return res.json();
};

export const registrarNotaP1 = async (
  professorId: string,
  payload: LancarNotaPayload,
  headers: Headers = {}
): Promise<Response> => post(`${API_URL}/professores/${professorId}/notas/p1`, payload, headers);

export const registrarNotaP2 = async (
  professorId: string,
  payload: LancarNotaPayload,
  headers: Headers = {}
): Promise<Response> => post(`${API_URL}/professores/${professorId}/notas/p2`, payload, headers);

export const registrarNotaP3 = async (
  professorId: string,
  payload: LancarNotaPayload,
  headers: Headers = {}
): Promise<Response> => post(`${API_URL}/professores/${professorId}/notas/p3`, payload, headers);
