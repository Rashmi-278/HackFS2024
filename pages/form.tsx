import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Field, Input, Button, Select, Toggle, Heading, Typography, EthSVG, WalletSVG, MoonSVG, CopySVG } from '@ensdomains/thorin';
import { throws } from 'assert';

const RegisterDAOForm: React.FC = () => {
  const { control, handleSubmit } = useForm();
  const [ ipfsURL, setIPFSURL ] = useState('')

  const onSubmit = async (data: any) => {
    const organizedData = {
      "@context": "https://www.daostar.org/schemas",
      "type": "DAO",
      "name": data.name,
      "description": data.description,
      "membersURI": data.membersURI,
      "proposalsURI": data.proposalsURI,
      "issuersURI": data.issuersURI,
      "activityLogURI": data.activityLogURI,
    };

    console.log(organizedData);

    // Optionally, you can upload to IPFS or make an API call here

    try {
      if (data.registerThroughENS === true) {
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

          console.log('IPFS URL:', `https://gateway.pinata.cloud/ipfs/${result.result.IpfsHash}`);
          setIPFSURL(`https://gateway.pinata.cloud/ipfs/${result.result.IpfsHash}`)

          // Set daoURI text record
        } else {
          console.error('Error uploading JSON to IPFS:', result.error);
        }
      }
      else {
        throw Error("User Consent required to create daoURI text record")
      }
    }
    catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
    }

};

return (
  <div >
    <Card>
      <h1>Register your DAO</h1>
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
      <Typography>Registering will generate a DAO URI</Typography>
    </Card>
  </div>
);
};

export default RegisterDAOForm;
