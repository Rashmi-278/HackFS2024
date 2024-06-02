import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Field, Input, Button, Select, Toggle, Heading, Typography, EthSVG, WalletSVG, MoonSVG, CopySVG } from '@ensdomains/thorin';
import { throws } from 'assert';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletClient, createWalletClient, custom, http } from 'viem'
import { ChainWithEns } from '@ensdomains/ensjs/dist/types/contracts/consts';
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { setTextRecord } from '@ensdomains/ensjs/wallet'
import { getResolver, getName } from '@ensdomains/ensjs/public'
import { useAccount } from 'wagmi'

const RegisterDAOForm: React.FC = () => {
  const { control, handleSubmit } = useForm();
  const [ipfsURL, setIPFSURL] = useState('');
  const { address, isConnected } = useAccount();
  let name: string | null = null;
  let match: boolean | null = null;
  let resolverAddress: `0x${string}` | null = null;
  // @ts-ignore
  let wallet;

  if (typeof window !== 'undefined' && window.ethereum) {
    wallet = createWalletClient({
      chain: addEnsContracts(mainnet),
      transport: custom(window.ethereum),
    });
  }
 
  const onSubmit = async (data: any) => {
    if (isConnected && address) {
      const addressENS = address as `0x${string}`;
      try {
        // @ts-ignore
        const result = await getName(wallet, { address: addressENS });
        name = result.name;
        match = result.match;
        resolverAddress = result.resolverAddress;
        console.log(name)
        console.log(resolverAddress)
      } catch (error) {
        console.error("Error fetching ENS name:", error);
      }
    } else {
      alert("Please connect your wallet.");
      console.error("Error, Wallet not connected:");
      return;
    }

    console.log(data);
    const organizedData = {
      "@context": "https://www.daostar.org/schemas",
      "type": "DAO",
      "name": data.daoName,
      "description": data.description,
      "membersURI": data.membersUri,
      "proposalsURI": data.proposalsUri,
      "issuersURI": data.issuersUri,
      "activityLogURI": data.activityLogUri,
      "managerAddress": data.managerAddress,
      "contractsRegistryURI": data.contractRegistryUri
    };

    console.log(organizedData);

    try {
      if (data.registerThroughENS) {
        const response = await fetch('/api/uploadToIpfs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(organizedData)
        });

        const result = await response.json();

        if (result.success) {
          console.log('JSON uploaded to IPFS:', result.result);

          const ipfsLink = `https://gateway.pinata.cloud/ipfs/${result.result.IpfsHash}`;
          setIPFSURL(ipfsLink);

          if (name && resolverAddress) {
            // @ts-ignore
            const hash = await setTextRecord(wallet, {
              name,
              key: 'daouri',
              value: ipfsLink,
              resolverAddress,
              account: address
            });
            console.log('daoURI text record set:', hash);
          } else {
            throw new Error("Name or resolver address is not set");
          }
        } else {
          console.error('Error uploading JSON to IPFS:', result.error);
        }
      } else {
        throw new Error("User Consent required to create daoURI text record");
      }
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
    }
  };

  return (
    <div>
      <Card>
        <h1>Register your DAO</h1>
        <ConnectButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="contractAddress"
            control={control}
            defaultValue="mainnet"
            render={({ field }) => (
              <Select
                label="netowrk"
                {...field}
                options={[
                  { value: 'mainnet', label: 'Mainnet', prefix: <EthSVG /> },
                  { value: 'testnet', label: 'Testnet', prefix: <WalletSVG /> },
                ]}
              />
            )}
          />

          <Controller
            name="daoName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} label="Name" placeholder="Enter DAO name" />
            )}
          />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} label="Description" placeholder="Enter DAO description" />
            )}
          />

          <Controller
            name="framework"
            control={control}
            defaultValue="custom"
            render={({ field }) => (
              <Select
                label="Framework"
                {...field}
                options={[
                  { value: 'custom', label: 'Custom', prefix: <MoonSVG /> },
                  { value: 'standard', label: 'Standard', prefix: <CopySVG /> },
                ]}
              />
            )}
          />

          <Controller
            name="membersUri"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} label="Members URI" placeholder="Enter URI to members" />
            )}
          />

          <Controller
            name="activityLogUri"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} label="Activity Log URI" placeholder="Enter URI to activity log" />
            )}
          />

          <Controller
            name="proposalsUri"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} label="Proposals URI" placeholder="Enter URI to proposals" />
            )}
          />

          <Controller
            name="issuersUri"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} label="Issuers URI" placeholder="Enter URI for Issuers" />
            )}
          />

          <Controller
            name="contractRegistryUri"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} label="Contract Registry URI (optional)" placeholder="Enter URI to contracts registry" />
            )}
          />

          <Controller
            name="managerAddress"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} label="Manager address (optional)" placeholder="Enter address of DAO manager" />
            )}
          />

          <Field label="governanceDocUri">
            <Controller
              name="governanceDocumentUri"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input {...field} label="Governance document (optional)" placeholder="Enter URI to governance document (.md)" />
              )}
            />
          </Field>

          <Field label="I agree to create 'daoURI' text record in my ENS Domain" style={{ marginTop: "20px" }}>
            <Controller
              name="registerThroughENS"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Toggle size='small' {...field} />
              )}
            />
          </Field>

          <Button type="submit">Register</Button>
        </form>
        <Typography>Registering will generate a DAO URI {ipfsURL}</Typography>
      </Card>
    </div>
  );
};

export default RegisterDAOForm;
