import React from 'react';
import styled from 'styled-components';
import { Button } from '@ensdomains/thorin';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4em 2em;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 8em 4em;
  }

  @media (min-width: 1280px) {
    padding: 16em 4em;
  }
`;

const BoxContainer = styled.div`
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    width: 75%; /* 3/4 for md */
  }

  @media (min-width: 1280px) {
    width: 66.67%; /* 8/12 for lg */
  }

  @media (min-width: 1440px) {
    width: 41.67%; /* 5/12 for xl */
  }
`;

const HStackContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  align-items: stretch;
  gap: 1rem; /* Adjust the gap as needed */

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const UppercaseText = styled.p`
  margin-bottom: 8px;
  margin-left: 2px;
  font-size: 0.75rem; /* xs */
  font-weight: 600;
  letter-spacing: 0.1em;
  color: gray.400;
  text-transform: uppercase;
`;

const Heading = styled.h1`
  margin-bottom: 16px;
  font-size: 1.875rem; /* 3xl for base */
  font-weight: bold;
  line-height: 1.25;
  color: gray.900;

  @media (min-width: 768px) { /* md breakpoint */
    font-size: 2.25rem; /* 4xl */
  }

  ${({ theme }) => theme.mode === 'dark' && `
    color: white;
  `}
`;

const Description = styled.p`
  margin-bottom: 16px;
  color: gray.500;

  @media (min-width: 768px) { /* md breakpoint */
    font-size: 1.125rem; /* lg */
  }
`;

const LandingPage: React.FC = () => {
  return (
    <FlexContainer>
      <BoxContainer>
        <UppercaseText>For DAOs</UppercaseText>
        <Heading>Organize DAO Metadata with EIP-4824</Heading>
        <Description>
          Today every DAO have their governance set up with DAO Contracts, Treasury Contracts and other infrastructure like Bridges.
          But the metadata of DAOs in the current state is highly disorganized, which makes it difficult for DAO tooling providers, aggregators etc to Index a DAO.
        </Description>
        <HStackContainer>
          <Button colorStyle="blueSecondary">Lean More</Button>
          <Button colorStyle="blueGradient">Adopt EIP-4824</Button>
        </HStackContainer>
      </BoxContainer>
    </FlexContainer>
  );
};

export default LandingPage;
