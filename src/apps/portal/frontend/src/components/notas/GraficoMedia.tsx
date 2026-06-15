import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { GraficoData } from '../../services/aluno';

function GraficoMedia({ data }: { data: GraficoData }) {
  const chartData = [
    {
      name: 'Médias',
      'Minha Média': data.mediaAluno,
      'Média da Turma': data.mediaTurma,
    },
  ];

  return (
    <div>
      <h3 className="text-2xl text-gray-700 font-semibold mb-4">Gráfico Comparativo</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={6} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Mínimo (6.0)', position: 'insideTopRight', fill: '#ef4444', fontSize: 12 }} />
            <Bar dataKey="Minha Média" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Média da Turma" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoMedia;
