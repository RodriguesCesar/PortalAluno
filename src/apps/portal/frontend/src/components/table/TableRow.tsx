import React, { ReactNode } from 'react';

function TableRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <tr className={`border-b border-gray-200 hover:bg-gray-50 ${className}`}>{children}</tr>;
}

export default TableRow;
