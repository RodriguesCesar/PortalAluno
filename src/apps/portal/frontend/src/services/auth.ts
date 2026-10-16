import { requestJson } from './http';

export type Perfil = 'ALUNO' | 'PROFESSOR';

export type LoginResult = {
  token: string;
  perfil: Perfil;
  referenciaId: string;
};

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

export const login = async (email: string, senha: string): Promise<LoginResult> =>
  requestJson<LoginResult>(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    },
    'Credenciais inválidas.'
  );
