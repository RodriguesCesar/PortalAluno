import React, { ReactNode } from 'react';

function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export default TableHeader;
