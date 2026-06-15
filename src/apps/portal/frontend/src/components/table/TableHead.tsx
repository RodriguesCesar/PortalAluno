import React from 'react';

function TableHead({ name }: { name: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600 border-b border-gray-300">
      {name}
    </th>
  );
}

export default TableHead;
