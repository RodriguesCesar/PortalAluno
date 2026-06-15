import React, { ReactNode } from 'react';
import PageTitle from './PageTitle';
import PageAlert from './PageAlert';
import PageContent from './PageContent';

type Props = {
  title: string;
  alert?: string;
  children?: ReactNode;
};

function PageContainer({ title, alert, children }: Props) {
  return (
    <div>
      {alert && <PageAlert message={alert} />}
      <PageTitle title={title} />
      <PageContent>{children}</PageContent>
    </div>
  );
}

export default PageContainer;
