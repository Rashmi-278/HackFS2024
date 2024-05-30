import fs from 'fs';
import { FleekSdk, PersonalAccessTokenService } from '@fleekxyz/sdk';
import dotenv from 'dotenv';
import { UploadResult } from '@fleekxyz/sdk/dist-types/clients/ipfs';

dotenv.config();

const pat = process.env.PAT || '';
const project_id = process.env.PROJECT_ID || '';

const patService = new PersonalAccessTokenService({
    personalAccessToken: pat,
    projectId: project_id
});

const fleekSdk = new FleekSdk({ accessTokenService: patService });

interface IPFSUploadResult {
    cid: string;
    path: string;
    size: number;
}

export default async function uploadJsonToIPFS(filename: string, jsonContent: object): Promise<UploadResult> {
    const bufferContent = Buffer.from(JSON.stringify(jsonContent));
    const result = await fleekSdk.ipfs().add({
        path: filename,
        content: bufferContent
    });
    return result;
}


