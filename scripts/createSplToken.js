const fs = require('fs');
const metadata = require('../data/metadata.json');
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} = require('@solana/spl-token');
const { connection, wallet: payer } = require('../config');

(async () => {
  try {
    const mintAuthority = payer;
    const freezeAuthority = payer;

    // creating the mint address for your token
    const mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      9, // decimal
    );

    // getting/creating your token account associated with the above mint token
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
    );

    // mint the spl tokens into your token account
    await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      mintAuthority,
      metadata.totalSupply, // amount
    );

    const tokenAccountAddress = tokenAccount.address.toString();
    const mintAccountAddress = tokenAccount.mint.toString();
    console.log('Token Address:', tokenAccountAddress);
    console.log('Mint Address:', mintAccountAddress);

    const filePath = './data/tokenDetails.json';

    fs.writeFileSync(
      filePath,
      JSON.stringify({
        tokenAccount: tokenAccountAddress,
        mintAccount: mintAccountAddress,
      }),
    );
  } catch (err) {
    console.log(err);
  }
})();
