import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageContainer from '../../components/page-container/PageContainer';
import PageSeparator from '../../components/page-container/PageSeparator';
import NotasDisciplina from '../../components/notas/NotasDisciplina';
import GraficoMedia from '../../components/notas/GraficoMedia';
import StatusBadge from '../../components/status-badge/StatusBadge';
import {
  Notas,
  GraficoData,
  Status,
  getNotas,
  getStatusDisciplina,
  getGraficoMedia,
} from '../../services/aluno';
import { useAuth } from '../../contexts/AuthContext';

function AlunoDisciplina() {
  const { alunoId, disciplinaId } = useParams<{ alunoId: string; disciplinaId: string }>();
  const [searchParams] = useSearchParams();
  const turmaId = searchParams.get('turmaId') ?? '';
  const { authHeader } = useAuth();

  const [notas, setNotas] = useState<Notas | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [grafico, setGrafico] = useState<GraficoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!alunoId || !disciplinaId) return;

    const fetchData = async () => {
      try {
        const [notasData, statusData] = await Promise.all([
          getNotas(alunoId, disciplinaId, turmaId, authHeader()),
          getStatusDisciplina(alunoId, disciplinaId, turmaId, authHeader()),
        ]);
        setNotas(notasData);
        setStatus(statusData.status);

        if (turmaId) {
          const graficoData = await getGraficoMedia(alunoId, turmaId, disciplinaId, authHeader());
          setGrafico(graficoData);
        }
      } catch {
        setError('Não foi possível carregar as informações da disciplina.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [alunoId, disciplinaId, turmaId, authHeader]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 p-5 text-center text-gray-500 mt-10">
        Carregando disciplina...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 p-5">
      <Helmet>
        <title>Portal de Notas | Disciplina</title>
      </Helmet>

      <PageContainer title="Detalhes da Disciplina" alert={error}>
        <div className="mb-4">
          <Link
            to={`/aluno/${alunoId}`}
            className="text-teal-600 hover:text-teal-800 text-sm font-medium"
          >
            ← Voltar ao meu portal
          </Link>
        </div>

        {status && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gray-600 font-medium">Status:</span>
            <StatusBadge status={status} />
          </div>
        )}

        {notas && (
          <>
            <NotasDisciplina notas={notas} />
            <PageSeparator />
          </>
        )}

        {grafico && <GraficoMedia data={grafico} />}
      </PageContainer>
    </div>
  );
}

export default AlunoDisciplina;
