import React from 'react';

function PageTitle({ title }: { title: string }) {
  return <h1 className="text-5xl text-gray-800 text-center my-6">{title}</h1>;
}

export default PageTitle;
