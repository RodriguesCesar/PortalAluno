import { IdAluno } from "../../Shared/types";


export type Aluno = {
  id: IdAluno;
  nome: string;
  idade?: number;
  ra: string;
  usuarioId: string; // referência para o usuário de identidade e acesso
  createdAt: Date;
}