// components/DisplayENSTextRecord.tsx
import React, { useState, useEffect, Fragment } from 'react';
import { Card, Typography } from '@ensdomains/thorin';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { addEnsContracts } from '@ensdomains/ensjs';
import { getTextRecord } from '@ensdomains/ensjs/public';


const client = createPublicClient({
    chain: addEnsContracts(mainnet),
    transport: http(),
});

interface DisplayENSTextRecordProps {
    name: string;
    resolvedAddress: {
        id: string;
    } | null;
}

const DisplayENSTextRecord: React.FC<DisplayENSTextRecordProps> = ({
    name,
    resolvedAddress
}) => {
    const [daoURI, setDaoURI] = useState("Loading...");
    const daoName = name ?? "Unknown DAO";
    const daoAddress = resolvedAddress?.id ?? "Unknown DAO";

    useEffect(() => {
        const fetchDaoURI = async () => {
            try {
                const uri = await getTextRecord(client, {
                    name,
                    key: 'daoURI',
                });
                setDaoURI(uri || "https://daostar.org/registration");
            } catch (error) {
                console.error("Error fetching DAO URI:", error);
                setDaoURI("https://daostar.org/registration");
            }
        };

        fetchDaoURI();
    }, [name]);

    return (
        <Card className="cardens" title={daoName}>
            <hr className="divider" />
                <div className="cardMetadata">
                    <Typography>
                        <span style={{ fontWeight: 'bold', color: 'purple'}}>DAO Address: </span>
                        {daoAddress}
                    </Typography>
                    <Typography  style={{ wordWrap: 'break-word' }}>
                        <span style={{ fontWeight: 'bold', color: 'purple'}}>DAO URI: </span>
                       <a href={daoURI} className='anchor'>{daoURI}</a>
                    </Typography>
                </div>
        </Card>
    );
};

export default DisplayENSTextRecord;
