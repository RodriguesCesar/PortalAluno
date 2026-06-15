export type Perfil = 'ALUNO' | 'PROFESSOR';

export type Usuario = {
  id: string;
  email: string;
  senhaHash: string;
  perfil: Perfil;
  referenciaId: string; // alunoId ou professorId
};
