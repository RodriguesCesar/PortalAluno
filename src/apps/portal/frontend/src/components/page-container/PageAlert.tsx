import React from 'react';

function PageAlert({ message }: { message: string }) {
  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded flex items-center gap-2 mb-4">
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default PageAlert;
