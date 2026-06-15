import React, { ReactNode } from 'react';

function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-4 py-3 text-gray-700">{children}</td>;
}

export default TableCell;
