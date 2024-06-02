// pages/explorer.tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import DomainExplorer from '../components/DomainExplorer';
import { Typography } from '@ensdomains/thorin';

const ExplorerPage: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="containerens">
        <Typography fontVariant="extraLargeBold">
          Domain Explorer
        </Typography>
        <DomainExplorer />
      </div>
    </ApolloProvider>
  );
};

export default ExplorerPage;
