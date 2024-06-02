import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Button, Card } from '@ensdomains/thorin';
import styled from 'styled-components';
import stylesCard from '../styles/DescriptionStyles.module.css';



const HStackContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  align-items: stretch;
  gap: 1rem; /* Adjust the gap as needed */

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;



const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ENS EIP-4824</title>
        <meta
          content="Adopt EIP-4824 for DAOS"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>

        <h1 className={styles.title} >
          Adopt the  <a href="https://eips.ethereum.org/EIPS/eip-4824">DAO Metadata</a> Standard {' '} <br />
        </h1>

        

        <div className={stylesCard.container}>
      <div className={stylesCard.title}>
        Get started by creating and publishing{' '}
        <a href=''>DAO URI</a>
      </div>
      <div className={stylesCard.text}>
      To understand a DAO, you need detailed info on its governance, proposals, members, and activities, typically scattered across various platforms. EIP-4824 addresses this by introducing a daoURI, a URI that consolidates a DAO&apos;s metadata.
      </div>
    </div>

       
        <HStackContainer>
          <a href="https://docs.daostar.org/How%20To's/DifferentPaths" target='_blank' >
            <Button colorStyle="purpleSecondary">Lean More</Button></a>
          <a href="form">
            <Button colorStyle="purpleGradient">Adopt EIP-4824</Button>
          </a>
        </HStackContainer>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ using Nextjs, ENSjs, RainbowKit, IPFS, Thorin Design System
        </a>
      </footer>
    </div>
  );
};

export default Home;
