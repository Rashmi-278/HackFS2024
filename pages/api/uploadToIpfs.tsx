import { NextApiRequest, NextApiResponse } from 'next';
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';

dotenv.config();

const pinataApiKey = process.env.PINATA_API_KEY || '';
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY || '';

const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey);

interface IPFSUploadResult {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const jsonContent = req.body;


        try {
            const result: IPFSUploadResult = await pinata.pinJSONToIPFS(jsonContent);
            res.status(200).json({ success: true, result });
        } catch (error) {
            const err = error as Error;

            console.error('Error uploading JSON to IPFS:', err);
            res.status(500).json({ success: false, error: err.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
}
