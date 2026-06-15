import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import AlunoDashboard from './pages/aluno/AlunoDashboard';
import AlunoDisciplina from './pages/aluno/AlunoDisciplina';
import ProfessorDashboard from './pages/professor/ProfessorDashboard';
import ProfessorVinculo from './pages/professor/ProfessorVinculo';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* Aluno */}
          <Route path="/aluno/:alunoId" element={
            <PrivateRoute perfil="ALUNO"><AlunoDashboard /></PrivateRoute>
          } />
          <Route path="/aluno/:alunoId/disciplinas/:disciplinaId" element={
            <PrivateRoute perfil="ALUNO"><AlunoDisciplina /></PrivateRoute>
          } />
          {/* Professor */}
          <Route path="/professor/:professorId" element={
            <PrivateRoute perfil="PROFESSOR"><ProfessorDashboard /></PrivateRoute>
          } />
          <Route path="/professor/:professorId/vinculos/:vinculoId" element={
            <PrivateRoute perfil="PROFESSOR"><ProfessorVinculo /></PrivateRoute>
          } />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
