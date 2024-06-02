import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Field, Input, Button, Select, Toggle, Typography, EthSVG, WalletSVG, MoonSVG, CopySVG, Toast } from '@ensdomains/thorin';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletClient, createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';
import { addEnsContracts } from '@ensdomains/ensjs';
import { setTextRecord } from '@ensdomains/ensjs/wallet';
import { getResolver, getName } from '@ensdomains/ensjs/public';
import { useAccount } from 'wagmi';

const RegisterDAOForm: React.FC = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      contractAddress: 'mainnet',
      daoName: '',
      description: '',
      framework: 'custom',
      membersUri: '',
      activityLogUri: '',
      proposalsUri: '',
      issuersUri: '',
      contractRegistryUri: '',
      managerAddress: '',
      governanceDocumentUri: '',
      registerThroughENS: false,
    },
  });
  
  const [ipfsURL, setIPFSURL] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const { address, isConnected } = useAccount();
  let name: string | null = null;
  let resolverAddress: `0x${string}` | null = null;
  //@ts-ignore
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
          //@ts-ignore
        const result = await getName(wallet, { address: addressENS });
        name = result.name;
        resolverAddress = result.resolverAddress;
        console.log(name);
        console.log(resolverAddress);
      } catch (error) {
        console.error("Error fetching ENS name:", error);
      }
    } else {
      alert("Please connect your wallet.");
      console.error("Error, Wallet not connected:");
      return;
    }

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
          const ipfsLink = `https://gateway.pinata.cloud/ipfs/${result.result.IpfsHash}`;
          setIPFSURL(ipfsLink);
          setToastMessage('IPFS URL generated successfully!');
          setToastOpen(true);

          if (name && resolverAddress) {
              //@ts-ignore

            const hash = await setTextRecord(wallet, {
              name,
              key: 'daouri',
              value: ipfsLink,
              resolverAddress,
              account: address
            });
            console.log('daoURI text record set:', hash);
            setToastMessage('DAO URI text record set successfully!');
            setToastOpen(true);
          } else {
            throw new Error("Name or resolver address is not set");
          }
        } else {
          console.error('Error uploading JSON to IPFS:', result.error);
          setToastMessage('Error uploading JSON to IPFS.');
          setToastOpen(true);
        }
      } else {
        throw new Error("User Consent required to create daoURI text record");
      }
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      setToastMessage('Error uploading JSON to IPFS.');
      setToastOpen(true);
    }
  };

  return (
    <div className='formContainer'>
      <Toast
        description={toastMessage!}
        open={toastOpen}
        title="Notification"
        variant="desktop"
        onClose={() => setToastOpen(false)}
      />
      <Card>
        <Typography fontVariant='extraLargeBold'>
          <h1>Register your DAO</h1>
        </Typography>
        <div style={{ marginLeft: '30px' }}>
          <ConnectButton />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="contractAddress"
            control={control}
            render={({ field }) => (
              <Select
                label="Network"
                {...field}
                options={[
                  { value: 'mainnet', label: 'Mainnet', prefix: <EthSVG /> },
                  { value: 'arbitrum', label: 'Arbitrum One' },
                  { value: 'optimism', label: 'Optimism' },
                ]}
              />
            )}
          />

          <Controller
            name="daoName"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Name" placeholder="Enter DAO name" />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Description" placeholder="Enter DAO description" />
            )}
          />

          <Controller
            name="framework"
            control={control}
            render={({ field }) => (
              <Select
                label="Framework"
                {...field}
                options={[
                  { value: 'custom', label: 'Custom', prefix: <MoonSVG /> },
                  { value: 'snapshot', label: 'Snapshot' },
                  { value: 'aragon', label: 'Aragon' },
                ]}
              />
            )}
          />

          <Controller
            name="membersUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Members URI" placeholder="Enter URI to members" />
            )}
          />

          <Controller
            name="activityLogUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Activity Log URI" placeholder="Enter URI to activity log" />
            )}
          />

          <Controller
            name="proposalsUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Proposals URI" placeholder="Enter URI to proposals" />
            )}
          />

          <Controller
            name="issuersUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Issuers URI" placeholder="Enter URI for Issuers" />
            )}
          />

          <Controller
            name="contractRegistryUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Contract Registry URI (optional)" placeholder="Enter URI to contracts registry" />
            )}
          />

          <Controller
            name="managerAddress"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Manager address (optional)" placeholder="Enter address of DAO manager" />
            )}
          />

          <Controller
            name="governanceDocumentUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Governance document (optional)" placeholder="Enter URI to governance document (.md)" />
            )}
          />

<Field label="I agree to create 'daoURI' text record in my ENS Domain" style={{ marginTop: "20px" }}>
            <Controller
              name="registerThroughENS"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                //@ts-ignore

                <Toggle size='small' {...field} />
              )}
            />
          </Field>

          <Button type="submit">Register</Button>
        </form>
        {ipfsURL && (
          <Typography style={{ wordWrap: 'break-word', marginTop: '10px' }}>
            Here's your generated DAO URI: {ipfsURL}
          </Typography>
        )}
      </Card>
    </div>
  );
};

export default RegisterDAOForm;
