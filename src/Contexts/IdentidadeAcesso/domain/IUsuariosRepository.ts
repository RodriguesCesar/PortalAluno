import { Usuario } from './Usuario';

export interface IUsuariosRepository {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  salvar(usuario: Usuario): Promise<void>;
}
