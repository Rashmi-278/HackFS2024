import { useState } from 'react';

const TestPage = () => {
    const [jsonData] = useState({
        key: "value",
        anotherKey: "anotherValue"
    });

    const uploadToIpfs = async () => {
        try {
            const response = await fetch('/api/uploadToIpfs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            const data = await response.json();

            if (data.success) {
                alert('JSON uploaded to IPFS:' + data.result);
                console.log('IPFS URL:', `https://gateway.pinata.cloud/ipfs/${data.result.IpfsHash}`);
            } else {
                console.error('Error uploading JSON to IPFS:', data.error);
            }
        } catch (error) {
            console.error('Error uploading JSON to IPFS:', error);
        }
    };

    return (
        <div>
            <h1>Upload JSON to IPFS Test</h1>
            <button onClick={uploadToIpfs}>Upload</button>
        </div>
    );
};

export default TestPage;
