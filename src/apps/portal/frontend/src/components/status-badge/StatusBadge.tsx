import React from 'react';

type Status = 'CURSANDO' | 'APROVADO' | 'REPROVADO';

const colorMap: Record<Status, string> = {
  CURSANDO: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  APROVADO: 'bg-green-100 text-green-800 border-green-300',
  REPROVADO: 'bg-red-100 text-red-800 border-red-300',
};

const labelMap: Record<Status, string> = {
  CURSANDO: 'Cursando',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${colorMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}

export default StatusBadge;
