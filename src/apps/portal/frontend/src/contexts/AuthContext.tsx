import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { Perfil } from '../services/auth';

const TOKEN_KEY = 'portal_notas_token';
const PERFIL_KEY = 'portal_notas_perfil';
const REF_KEY = 'portal_notas_referenciaId';

type AuthState = {
  token: string | null;
  perfil: Perfil | null;
  referenciaId: string | null;
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  signIn: (token: string, perfil: Perfil, referenciaId: string) => void;
  signOut: () => void;
  authHeader: () => { Authorization: string } | Record<string, never>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    token: localStorage.getItem(TOKEN_KEY),
    perfil: localStorage.getItem(PERFIL_KEY) as Perfil | null,
    referenciaId: localStorage.getItem(REF_KEY),
  }));

  const signIn = useCallback((token: string, perfil: Perfil, referenciaId: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(PERFIL_KEY, perfil);
    localStorage.setItem(REF_KEY, referenciaId);
    setState({ token, perfil, referenciaId });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PERFIL_KEY);
    localStorage.removeItem(REF_KEY);
    setState({ token: null, perfil: null, referenciaId: null });
  }, []);

  const authHeader = useCallback((): { Authorization: string } | Record<string, never> => {
    return state.token ? { Authorization: `Bearer ${state.token}` } : {};
  }, [state.token]);

  return (
    <AuthContext.Provider
      value={{ ...state, isAuthenticated: !!state.token, signIn, signOut, authHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
