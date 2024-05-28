import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Field, Input, Button, Select, Toggle, Heading, Typography, EthSVG, WalletSVG, MoonSVG, CopySVG } from '@ensdomains/thorin';

const RegisterDAOForm: React.FC = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
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

          <Field label="register">
            <Controller
              name="registerThroughEas"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Toggle {...field} />
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
