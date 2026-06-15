import { Request, Response } from 'express';
import { LoginCommandHandler } from '../../../../Contexts/IdentidadeAcesso/application/LoginCommandHandler';

export class AuthController {
  constructor(private readonly loginHandler: LoginCommandHandler) {}

  login = async (request: Request, response: Response) => {
    const { email, senha } = request.body as { email?: string; senha?: string };

    if (!email || !senha) {
      response.status(400).json({ message: 'Email e senha são obrigatórios.' });
      return;
    }

    try {
      const result = await this.loginHandler.executar({ email, senha });
      response.json(result);
    } catch (err) {
      response.status(401).json({ message: (err as Error).message });
    }
  };
}
