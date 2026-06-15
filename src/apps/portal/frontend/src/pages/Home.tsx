import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageContainer from '../components/page-container/PageContainer';

function Home() {
  return (
    <div className="container mx-auto px-4 p-5">
      <Helmet>
        <title>Portal de Notas | Início</title>
      </Helmet>
      <PageContainer title="Portal de Notas">
        <p className="text-center text-gray-600 text-lg mt-4">
          Bem-vindo ao Portal de Notas. Acesse seu portal de aluno pelo menu acima.
        </p>
      </PageContainer>
    </div>
  );
}

export default Home;
