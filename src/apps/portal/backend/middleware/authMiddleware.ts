import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Perfil } from '../../../../Contexts/IdentidadeAcesso/domain/Usuario';

export type AuthPayload = {
  sub: string;
  perfil: Perfil;
  referenciaId: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function authMiddleware(jwtSecret: string) {
  return (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      response.status(401).json({ message: 'Token não fornecido.' });
      return;
    }

    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, jwtSecret) as AuthPayload;
      request.auth = payload;
      next();
    } catch {
      response.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  };
}

export function requirePerfil(perfil: Perfil) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (request.auth?.perfil !== perfil) {
      response.status(403).json({ message: 'Acesso negado.' });
      return;
    }
    next();
  };
}
