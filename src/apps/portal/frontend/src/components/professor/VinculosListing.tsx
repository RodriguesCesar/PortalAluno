import React from 'react';
import { Link } from 'react-router-dom';
import { VinculoDocente } from '../../services/professor';
import Table from '../table/Table';
import TableHeader from '../table/TableHeader';
import TableBody from '../table/TableBody';
import TableRow from '../table/TableRow';
import TableHead from '../table/TableHead';
import TableCell from '../table/TableCell';

type Props = {
  professorId: string;
  vinculos: VinculoDocente[];
};

function VinculosListing({ professorId, vinculos }: Props) {
  if (vinculos.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">Nenhum vínculo encontrado.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead name="Curso" />
          <TableHead name="Turma" />
          <TableHead name="Disciplina" />
          <TableHead name="Ações" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {vinculos.map((v) => (
          <TableRow key={v.vinculoId}>
            <TableCell>{v.curso}</TableCell>
            <TableCell>{v.turma}</TableCell>
            <TableCell>{v.disciplina}</TableCell>
            <TableCell>
              <Link
                to={`/professor/${professorId}/vinculos/${v.vinculoId}`}
                className="text-teal-600 hover:text-teal-800 font-medium text-sm"
              >
                Ver alunos →
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default VinculosListing;
