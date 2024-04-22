const fs = require('fs');
const tokenMetadata = require('../data/metadata.json');
const pinataSDK = require('@pinata/sdk');

require('dotenv').config();

const uploadMetadataToIpfs = async () => {
  try {
    const pinata = new pinataSDK(
      process.env.PINATA_API_KEY,
      process.env.PINATA_SECRET_KEY,
    );

    const imagePath = './data/image/token-image.jpg';
    const image = fs.createReadStream(imagePath);

    const result = await pinata.pinFileToIPFS(image, {
      pinataMetadata: { name: 'tokenImage' },
    });
    console.log('Image uploaded to IPFS:', result.IpfsHash);

    const metadata = {
      name: tokenMetadata.name,
      symbol: tokenMetadata.symbol,
      description: tokenMetadata.description,
      image: `http://ipfs.io/ipfs/${result.IpfsHash}`,
    };

    const metadataResult = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: { name: 'tokenMetadata' },
    });
    console.log('JSON uploaded to IPFS:', metadataResult.IpfsHash);

    const filePath = './data/metadata.json';
    const rawData = fs.readFileSync(filePath);

    let info = JSON.parse(rawData.toString());
    info = { ...info, uri: `http://ipfs.io/ipfs/${metadataResult.IpfsHash}` };

    fs.writeFileSync(filePath, JSON.stringify(info));
  } catch (err) {
    console.log(err);
  }
};

uploadMetadataToIpfs();
