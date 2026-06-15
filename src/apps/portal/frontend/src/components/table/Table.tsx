import React, { ReactNode } from 'react';

function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full table-auto border-collapse ${className}`}>{children}</table>
    </div>
  );
}

export default Table;
