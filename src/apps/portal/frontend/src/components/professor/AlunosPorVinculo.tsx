import React, { useState } from 'react';
import { AlunoVinculo, LancarNotaPayload, registrarNotaP1, registrarNotaP2 } from '../../services/professor';
import StatusBadge from '../status-badge/StatusBadge';
import LancarNotaModal from './LancarNotaModal';
import Table from '../table/Table';
import TableHeader from '../table/TableHeader';
import TableBody from '../table/TableBody';
import TableRow from '../table/TableRow';
import TableHead from '../table/TableHead';
import TableCell from '../table/TableCell';

type Prova = 'P1' | 'P2';

type ModalState = {
  alunoId: string;
  alunoNome: string;
  prova: Prova;
} | null;

type Props = {
  professorId: string;
  vinculoId: string;
  turmaId: string;
  disciplinaId: string;
  alunos: AlunoVinculo[];
  authHeader: Record<string, string>;
  onNotaRegistrada: () => void;
  onError: (msg: string) => void;
};

function AlunosPorVinculo({
  professorId,
  turmaId,
  disciplinaId,
  alunos,
  authHeader,
  onNotaRegistrada,
  onError,
}: Props) {
  const [modal, setModal] = useState<ModalState>(null);

  const handleConfirm = async (valor: number) => {
    if (!modal) return;
    const payload: LancarNotaPayload = {
      alunoId: modal.alunoId,
      turmaId,
      disciplinaId,
      nota: valor,
    };
    try {
      const fn = modal.prova === 'P1' ? registrarNotaP1 : registrarNotaP2;
      const res = await fn(professorId, payload, authHeader);
      if (!res.ok) throw new Error();
      setModal(null);
      onNotaRegistrada();
    } catch {
      onError(`Erro ao lançar ${modal.prova}. Tente novamente.`);
      setModal(null);
    }
  };

  const notaOuDash = (valor?: number) =>
    valor !== undefined && valor !== null ? valor.toFixed(1) : '—';

  if (alunos.length === 0) {
    return <p className="text-gray-500 text-center py-6">Nenhum aluno encontrado.</p>;
  }

  return (
    <>
      {modal && (
        <LancarNotaModal
          alunoId={modal.alunoId}
          alunoNome={modal.alunoNome}
          prova={modal.prova}
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
            <TableHead name="Média" />
            <TableHead name="Status" />
            <TableHead name="Ações" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunos.map((a) => (
            <TableRow key={a.alunoId}>
              <TableCell>{a.nome}</TableCell>
              <TableCell>{notaOuDash(a.p1)}</TableCell>
              <TableCell>{notaOuDash(a.p2)}</TableCell>
              <TableCell>
                <span className={
                  a.mediaFinal === undefined || a.mediaFinal === null
                    ? 'text-gray-500'
                    : a.mediaFinal >= 6
                    ? 'text-green-600 font-bold'
                    : 'text-red-600 font-bold'
                }>
                  {notaOuDash(a.mediaFinal)}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={a.status} />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {a.p1 === undefined || a.p1 === null ? (
                    <button
                      onClick={() => setModal({ alunoId: a.alunoId, alunoNome: a.nome, prova: 'P1' })}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded transition"
                    >
                      + P1
                    </button>
                  ) : null}
                  {a.p2 === undefined || a.p2 === null ? (
                    <button
                      onClick={() => setModal({ alunoId: a.alunoId, alunoNome: a.nome, prova: 'P2' })}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded transition"
                    >
                      + P2
                    </button>
                  ) : null}
                  {a.p1 !== undefined && a.p1 !== null &&
                   a.p2 !== undefined && a.p2 !== null &&
                   (a.p1 + a.p2) / 2 < 6 &&
                   (a.p3 === undefined || a.p3 === null) && (
                    <span className="text-xs text-amber-600 font-semibold">Elegível P3</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default AlunosPorVinculo;
