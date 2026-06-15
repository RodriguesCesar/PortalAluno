import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageContainer from '../../components/page-container/PageContainer';
import PageSeparator from '../../components/page-container/PageSeparator';
import AlunosPorVinculo from '../../components/professor/AlunosPorVinculo';
import ElegiveisP3 from '../../components/professor/ElegiveisP3';
import {
  AlunoVinculo,
  AlunoElegivel,
  VinculoDocente,
  getVinculos,
  getAlunosPorVinculo,
  getAlunosElegiveisP3,
} from '../../services/professor';
import { useAuth } from '../../contexts/AuthContext';

function ProfessorVinculo() {
  const { professorId, vinculoId } = useParams<{ professorId: string; vinculoId: string }>();
  const { authHeader } = useAuth();

  const [vinculo, setVinculo] = useState<VinculoDocente | null>(null);
  const [alunos, setAlunos] = useState<AlunoVinculo[]>([]);
  const [elegiveis, setElegiveis] = useState<AlunoElegivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');

  const fetchAlunos = useCallback(async () => {
    if (!professorId || !vinculoId) return;
    try {
      const [alunosData, elegiveisData] = await Promise.all([
        getAlunosPorVinculo(professorId, vinculoId, authHeader()),
        getAlunosElegiveisP3(professorId, vinculoId, authHeader()),
      ]);
      setAlunos(alunosData);
      setElegiveis(elegiveisData);
    } catch {
      setAlert('Erro ao carregar dados dos alunos.');
    }
  }, [professorId, vinculoId, authHeader]);

  useEffect(() => {
    if (!professorId || !vinculoId) return;

    const init = async () => {
      try {
        const todos = await getVinculos(professorId, authHeader());
        const found = todos.find((v) => v.vinculoId === vinculoId) ?? null;
        setVinculo(found);
        await fetchAlunos();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [professorId, vinculoId, fetchAlunos, authHeader]);

  const handleNotaRegistrada = () => {
    setAlert('Nota registrada com sucesso!');
    fetchAlunos();
    setTimeout(() => setAlert(''), 4000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 p-5 text-center text-gray-500 mt-10">
        Carregando...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 p-5">
      <Helmet>
        <title>Portal de Notas | Alunos da Turma</title>
      </Helmet>

      <PageContainer
        title={vinculo ? `${vinculo.disciplina}` : 'Alunos'}
        alert={alert}
      >
        {vinculo && (
          <p className="text-gray-500 text-center mb-6">
            {vinculo.curso} — {vinculo.turma}
          </p>
        )}

        <div className="mb-4">
          <Link
            to={`/professor/${professorId}`}
            className="text-teal-600 hover:text-teal-800 text-sm font-medium"
          >
            ← Voltar ao painel
          </Link>
        </div>

        <section>
          <h2 className="text-3xl text-gray-700 font-semibold mb-4">Alunos</h2>
          <AlunosPorVinculo
            professorId={professorId!}
            vinculoId={vinculoId!}
            turmaId={vinculo?.turmaId ?? ''}
            disciplinaId={vinculo?.disciplinaId ?? ''}
            alunos={alunos}
            authHeader={authHeader()}
            onNotaRegistrada={handleNotaRegistrada}
            onError={setAlert}
          />
        </section>

        {elegiveis.length > 0 && (
          <>
            <PageSeparator />
            <section>
              <h2 className="text-3xl text-amber-600 font-semibold mb-2">
                🔔 Elegíveis para Recuperação (P3)
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Alunos com média inicial abaixo de 6.0 que ainda não fizeram P3.
              </p>
              <ElegiveisP3
                professorId={professorId!}
                turmaId={vinculo?.turmaId ?? ''}
                disciplinaId={vinculo?.disciplinaId ?? ''}
                alunos={elegiveis}
                authHeader={authHeader()}
                onNotaRegistrada={handleNotaRegistrada}
                onError={setAlert}
              />
            </section>
          </>
        )}
      </PageContainer>
    </div>
  );
}

export default ProfessorVinculo;
