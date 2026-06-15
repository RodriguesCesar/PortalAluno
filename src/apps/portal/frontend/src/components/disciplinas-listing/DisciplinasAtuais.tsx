import React from 'react';
import { Link } from 'react-router-dom';
import { DisciplinaAtual } from '../../services/aluno';
import StatusBadge from '../status-badge/StatusBadge';
import Table from '../table/Table';
import TableHeader from '../table/TableHeader';
import TableBody from '../table/TableBody';
import TableRow from '../table/TableRow';
import TableHead from '../table/TableHead';
import TableCell from '../table/TableCell';

type Props = {
  alunoId: string;
  disciplinas: DisciplinaAtual[];
};

function DisciplinasAtuais({ alunoId, disciplinas }: Props) {
  if (disciplinas.length === 0) {
    return <p className="text-gray-500 text-center py-6">Nenhuma disciplina em andamento.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead name="Disciplina" />
          <TableHead name="Curso" />
          <TableHead name="Turma" />
          <TableHead name="Status" />
          <TableHead name="Ações" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {disciplinas.map((d) => (
          <TableRow key={`${d.disciplinaId}-${d.turmaId}`}>
            <TableCell>{d.nome}</TableCell>
            <TableCell>{d.curso}</TableCell>
            <TableCell>{d.turma}</TableCell>
            <TableCell>
              <StatusBadge status={d.status} />
            </TableCell>
            <TableCell>
              <Link
                to={`/aluno/${alunoId}/disciplinas/${d.disciplinaId}?turmaId=${d.turmaId}`}
                className="text-teal-600 hover:text-teal-800 font-medium text-sm"
              >
                Ver notas →
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DisciplinasAtuais;
