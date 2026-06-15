import React, { useState } from 'react';
import { AlunoElegivel, LancarNotaPayload, registrarNotaP3 } from '../../services/professor';
import LancarNotaModal from './LancarNotaModal';
import Table from '../table/Table';
import TableHeader from '../table/TableHeader';
import TableBody from '../table/TableBody';
import TableRow from '../table/TableRow';
import TableHead from '../table/TableHead';
import TableCell from '../table/TableCell';

type Props = {
  professorId: string;
  turmaId: string;
  disciplinaId: string;
  alunos: AlunoElegivel[];
  authHeader: Record<string, string>;
  onNotaRegistrada: () => void;
  onError: (msg: string) => void;
};

type ModalState = { alunoId: string; alunoNome: string } | null;

function ElegiveisP3({ professorId, turmaId, disciplinaId, alunos, authHeader, onNotaRegistrada, onError }: Props) {
  const [modal, setModal] = useState<ModalState>(null);

  const handleConfirm = async (valor: number) => {
    if (!modal) return;
    const payload: LancarNotaPayload = { alunoId: modal.alunoId, turmaId, disciplinaId, nota: valor };
    try {
      const res = await registrarNotaP3(professorId, payload, authHeader);
      if (!res.ok) throw new Error();
      setModal(null);
      onNotaRegistrada();
    } catch {
      onError('Erro ao lançar P3. Tente novamente.');
      setModal(null);
    }
  };

  if (alunos.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        Nenhum aluno elegível para recuperação.
      </p>
    );
  }

  return (
    <>
      {modal && (
        <LancarNotaModal
          alunoId={modal.alunoId}
          alunoNome={modal.alunoNome}
          prova="P3"
          turmaId={turmaId}
          disciplinaId={disciplinaId}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead name="Aluno" />
            <TableHead name="P1" />
            <TableHead name="P2" />
            <TableHead name="Média Inicial" />
            <TableHead name="Ações" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunos.map((a) => (
            <TableRow key={a.alunoId}>
              <TableCell>{a.nome}</TableCell>
              <TableCell>{a.p1 != null ? a.p1.toFixed(1) : '—'}</TableCell>
              <TableCell>{a.p2 != null ? a.p2.toFixed(1) : '—'}</TableCell>
              <TableCell>
                <span className="text-red-600 font-bold">
                  {a.p1 != null && a.p2 != null ? ((a.p1 + a.p2) / 2).toFixed(1) : '—'}
                </span>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => setModal({ alunoId: a.alunoId, alunoNome: a.nome })}
                  className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold px-3 py-1 rounded transition"
                >
                  Lançar P3
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default ElegiveisP3;
