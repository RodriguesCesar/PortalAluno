import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageContainer from '../../components/page-container/PageContainer';
import VinculosListing from '../../components/professor/VinculosListing';
import { VinculoDocente, getVinculos } from '../../services/professor';
import { useAuth } from '../../contexts/AuthContext';

function ProfessorDashboard() {
  const { professorId } = useParams<{ professorId: string }>();
  const { authHeader } = useAuth();
  const [vinculos, setVinculos] = useState<VinculoDocente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!professorId) return;
    getVinculos(professorId, authHeader())
      .then(setVinculos)
      .catch(() => setError('Não foi possível carregar os vínculos.'))
      .finally(() => setLoading(false));
  }, [professorId, authHeader]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 p-5 text-center text-gray-500 mt-10">
        Carregando vínculos...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 p-5">
      <Helmet>
        <title>Portal de Notas | Painel do Professor</title>
      </Helmet>

      <PageContainer title="Painel do Professor" alert={error}>
        <h2 className="text-3xl text-gray-700 font-semibold mb-4">Meus Vínculos</h2>
        <VinculosListing professorId={professorId!} vinculos={vinculos} />
      </PageContainer>
    </div>
  );
}

export default ProfessorDashboard;
