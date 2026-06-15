import React from 'react';
import { Notas } from '../../services/aluno';

function NotaCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center flex-1 min-w-[120px]">
      <p className="text-sm uppercase text-gray-500 font-semibold mb-2">{label}</p>
      <p className="text-4xl font-bold text-gray-800">
        {value !== undefined && value !== null ? value.toFixed(1) : '—'}
      </p>
    </div>
  );
}

function MediaCard({ media }: { media?: number }) {
  const color =
    media === undefined || media === null
      ? 'text-gray-800'
      : media >= 6
      ? 'text-green-600'
      : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow p-6 text-center flex-1 min-w-[120px] border-2 border-teal-300">
      <p className="text-sm uppercase text-gray-500 font-semibold mb-2">Média Final</p>
      <p className={`text-4xl font-bold ${color}`}>
        {media !== undefined && media !== null ? media.toFixed(1) : '—'}
      </p>
    </div>
  );
}

function NotasDisciplina({ notas }: { notas: Notas }) {
  return (
    <div>
      <h3 className="text-2xl text-gray-700 font-semibold mb-4">Notas</h3>
      <div className="flex gap-4 flex-wrap">
        <NotaCard label="P1" value={notas.p1} />
        <NotaCard label="P2" value={notas.p2} />
        {notas.p3 !== undefined && notas.p3 !== null && (
          <NotaCard label="P3 (Recuperação)" value={notas.p3} />
        )}
        <MediaCard media={notas.mediaFinal} />
      </div>
    </div>
  );
}

export default NotasDisciplina;
