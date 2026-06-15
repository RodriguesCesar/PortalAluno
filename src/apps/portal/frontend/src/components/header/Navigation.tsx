import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navigation() {
  const { isAuthenticated, perfil, referenciaId, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-teal-900 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-white font-bold text-xl">Portal de Notas</Link>
      <div className="flex gap-6 items-center">
        {isAuthenticated ? (
          <>
            {perfil === 'ALUNO' && (
              <Link to={`/aluno/${referenciaId}`} className="text-white hover:text-teal-200 transition">
                Meu Portal
              </Link>
            )}
            {perfil === 'PROFESSOR' && (
              <Link to={`/professor/${referenciaId}`} className="text-white hover:text-teal-200 transition">
                Painel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition"
            >
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="text-white hover:text-teal-200 transition font-semibold">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
