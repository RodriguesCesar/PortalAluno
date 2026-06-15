import { Db, WithId } from 'mongodb';
import { Usuario } from '../domain/Usuario';
import { IUsuariosRepository } from '../domain/IUsuariosRepository';

// Estrutura real dos documentos na coleção 'usuarios'
type UsuarioDoc = {
  _id: string;
  email: string;
  perfil: Usuario['perfil'];
  referenceId: string;
  credenciais: {
    login: string;
    senhaHash: string;
  };
  ativo?: boolean;
  createdAt?: Date;
};

export class MongoUsuariosRepository implements IUsuariosRepository {
  constructor(private readonly db: Db) {}

  async buscarPorEmail(email: string): Promise<Usuario | null> {

  
    const doc = await this.db
      .collection<UsuarioDoc>('usuarios')
      .findOne({ email: email.toLowerCase().trim() } as Partial<UsuarioDoc>);

    if (!doc) return null;

    const d = doc as WithId<UsuarioDoc>;
    return {
      id: d._id as unknown as string,
      email: d.email,
      senhaHash: d.credenciais.senhaHash,   // aninhado em credenciais
      perfil: d.perfil,
      referenciaId: d.referenceId,          // campo referenceId no banco
    };
  }

  async salvar(usuario: Usuario): Promise<void> {
    const doc: UsuarioDoc = {
      _id: usuario.id,
      email: usuario.email.toLowerCase().trim(),
      perfil: usuario.perfil,
      referenceId: usuario.referenciaId,
      credenciais: {
        login: usuario.email.toLowerCase().trim(),
        senhaHash: usuario.senhaHash,
      },
      ativo: true,
      createdAt: new Date(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.db
      .collection('usuarios')
      .replaceOne({ _id: usuario.id } as any, doc as any, { upsert: true });
  }
}
