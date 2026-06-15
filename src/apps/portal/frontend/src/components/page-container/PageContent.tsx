import React, { ReactNode } from 'react';

function PageContent({ children }: { children?: ReactNode }) {
  return <div className="mt-4">{children}</div>;
}

export default PageContent;
