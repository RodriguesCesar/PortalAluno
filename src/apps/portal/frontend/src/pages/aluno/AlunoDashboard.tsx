import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageContainer from '../../components/page-container/PageContainer';
import PageSeparator from '../../components/page-container/PageSeparator';
import DisciplinasAtuais from '../../components/disciplinas-listing/DisciplinasAtuais';
import DisciplinasConcluidaas from '../../components/disciplinas-listing/DisciplinasConcluidaas';
import {
  DisciplinaAtual,
  DisciplinaConcluida,
  getDisciplinasAtuais,
  getDisciplinasConcluidaas,
} from '../../services/aluno';
import { useAuth } from '../../contexts/AuthContext';

function AlunoDashboard() {
  const { alunoId } = useParams<{ alunoId: string }>();
  const { authHeader } = useAuth();
  const [atuais, setAtuais] = useState<DisciplinaAtual[]>([]);
  const [concluidas, setConcluidas] = useState<DisciplinaConcluida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!alunoId) return;

    const fetchData = async () => {
      try {
        const [atuaisData, concluidasData] = await Promise.all([
          getDisciplinasAtuais(alunoId, authHeader()),
          getDisciplinasConcluidaas(alunoId, authHeader()),
        ]);
        setAtuais(atuaisData);
        setConcluidas(concluidasData);
      } catch {
        setError('Não foi possível carregar as disciplinas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [alunoId, authHeader]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 p-5 text-center text-gray-500 mt-10">
        Carregando disciplinas...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 p-5">
      <Helmet>
        <title>Portal de Notas | Meu Portal</title>
      </Helmet>

      <PageContainer title="Meu Portal" alert={error}>
        <section>
          <h2 className="text-3xl text-gray-700 font-semibold mb-4">Disciplinas em Andamento</h2>
          <DisciplinasAtuais alunoId={alunoId!} disciplinas={atuais} />
        </section>

        <PageSeparator />

        <section>
          <h2 className="text-3xl text-gray-700 font-semibold mb-4">Disciplinas Concluídas</h2>
          <DisciplinasConcluidaas alunoId={alunoId!} disciplinas={concluidas} />
        </section>
      </PageContainer>
    </div>
  );
}

export default AlunoDashboard;
