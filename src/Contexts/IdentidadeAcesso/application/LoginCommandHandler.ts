import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUsuariosRepository } from '../domain/IUsuariosRepository';
import { Perfil } from '../domain/Usuario';

export type LoginCommand = {
  email: string;
  senha: string;
};

export type LoginResult = {
  token: string;
  perfil: Perfil;
  referenciaId: string;
};

export class LoginCommandHandler {
  constructor(
    private readonly usuariosRepository: IUsuariosRepository,
    private readonly jwtSecret: string
  ) 
  {
    
  }

  async executar(command: LoginCommand): Promise<LoginResult> {
   
    const usuario = await this.usuariosRepository.buscarPorEmail(command.email);
   
    if (!usuario) {
      throw new Error('usuário inválido.');
    }
   
    const senhaValida = await bcrypt.compare(command.senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new Error('senha inválida.');
    }

    const token = jwt.sign(
      {
        sub: usuario.id,
        perfil: usuario.perfil,
        referenciaId: usuario.referenciaId,
      },
      this.jwtSecret,
      { expiresIn: '8h' }
    );

    return { token, perfil: usuario.perfil, referenciaId: usuario.referenciaId };
  }
}
