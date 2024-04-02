const {} = require('@solana/web3.js');
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} = require('@solana/spl-token');
const { connection, wallet: payer } = require('../config');

const createSplToken = (async () => {
  try {
    const mintAuthority = payer;
    const freezeAuthority = payer;

    // creating the mint address for your token
    const mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      9,
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
      1000000000000000000n, // amount
    );
  } catch (err) {
    console.log(err);
  }
})();