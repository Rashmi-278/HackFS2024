// components/DomainExplorer.tsx
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import DisplayENSTextRecord from './DisplayENSTextRecord';
import { Typography } from '@ensdomains/thorin';

const GET_DOMAINS = gql`
  query Domains($where: Domain_filter, $first: Int) {
    domains(where: $where, first: $first) {
      name
      resolvedAddress {
        id
      }
      resolver {
        texts
      }
    }
  }
`;

const DomainExplorer: React.FC = () => {
  const { loading, error, data } = useQuery(GET_DOMAINS, {
    variables: {
      where: {
        resolver_: {
          texts_contains_nocase: ["daoURI"]
        }
      },
      first: 10
    }
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <div style={{ marginTop:"40px"}}>
      {data.domains.map((domain: any) => (
        <DisplayENSTextRecord
          key={domain.name}
          name={domain.name}
          resolvedAddress={domain.resolvedAddress}
        />
      ))}
    </div>
  );
};

export default DomainExplorer;
