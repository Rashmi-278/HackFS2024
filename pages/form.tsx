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
            // @ts-ignore
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
          setToastMessage('Error Setting daoURI Text Record.');
          setToastOpen(true);
        }
      } else {
        setToastMessage('User Consent required to create daoURI text record');
        setToastOpen(true);
        throw new Error("User Consent required to create daoURI text record");
      }
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      setToastMessage('Error uploading JSON to IPFS.');
      setToastOpen(true);
    }
  };

  return (
    <div style={{ margin: "80px 0px", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '100vh' }}>
      <Toast
        description={toastMessage!}
        open={toastOpen}
        title="Notification"
        variant="desktop"
        msToShow={8000}
        onClose={() => setToastOpen(false)}
      />
      <Card style={{ width: '900px' }}>
        <Typography fontVariant='extraLargeBold' style={{ alignSelf: 'center', margin: "10px 0px" }}>
          <h1>Register your DAO</h1>
        </Typography>
        <div style={{ marginLeft: '10px' }}>
          <ConnectButton />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>

          <div style={{ marginBottom: '20px'}}>
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
          </div>
         
          <div style={{ marginBottom: '20px'}}>

          <Controller
            name="daoName"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Name" 
                placeholder="Enter DAO name" />
            )}
          />
          </div>

          <div style={{ marginBottom: '20px'}}>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Description" placeholder="Enter DAO description" />
            )}
          />
          </div>
          <div style={{ marginBottom: '20px'}}>

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
          </div>

          <div style={{ marginBottom: '20px'}}>

          <Controller
            name="membersUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Members URI" placeholder="Enter URI to members" />
            )}
          />
          </div>
          <div style={{ marginBottom: '20px'}}>

          <Controller
            name="activityLogUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Activity Log URI" placeholder="Enter URI to activity log" />
            )}
          />
          </div>
          <div style={{ marginBottom: '20px'}}>

          <Controller
            name="proposalsUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Proposals URI" placeholder="Enter URI to proposals" />
            )}
          />
          </div>
          <div style={{ marginBottom: '20px'}}>


          <Controller
            name="issuersUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Issuers URI" placeholder="Enter URI for Issuers" />
            )}
          />
          </div>

          <div style={{ marginBottom: '20px'}}>

          <Controller
            name="contractRegistryUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Contract Registry URI (optional)" placeholder="Enter URI to contracts registry" />
            )}
          />
          </div>

          <div style={{ marginBottom: '20px'}}>

          <Controller
            name="managerAddress"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Manager address (optional)" placeholder="Enter address of DAO manager" />
            )}
          />
          </div>

          <div style={{ marginBottom: '20px'}}>

          <Controller
            name="governanceDocumentUri"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Governance document (optional)" placeholder="Enter URI to governance document (.md)" />
            )}
          />
          </div>


          <Field label="I agree to create 'daoURI' text record in my ENS Domain" style={{ marginBottom: "20px" }}>
            <Controller
              name="registerThroughENS"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                // @ts-ignore
                <Toggle size='small' {...field} style={{ marginLeft: '5px'}} />
              )}
            />
          </Field>

          <Button type="submit" style={{ marginTop: "20px"}}>Register</Button>
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
