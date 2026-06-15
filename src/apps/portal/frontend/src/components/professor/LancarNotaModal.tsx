import React, { useState } from 'react';

type Prova = 'P1' | 'P2' | 'P3';

type Props = {
  alunoNome: string;
  alunoId: string;
  turmaId: string;
  disciplinaId: string;
  prova: Prova;
  onConfirm: (valor: number) => Promise<void>;
  onCancel: () => void;
};

function LancarNotaModal({
  alunoNome,
  prova,
  onConfirm,
  onCancel,
}: Props) {
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(valor.replace(',', '.'));
    if (isNaN(num) || num < 0 || num > 10) {
      setError('Informe um valor entre 0 e 10.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onConfirm(num);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Lançar {prova}</h2>
        <p className="text-gray-500 mb-6">
          Aluno: <span className="font-semibold text-gray-700">{alunoNome}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nota (0 – 10)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex: 7.5"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 mb-1"
            autoFocus
          />
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Confirmar'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LancarNotaModal;
