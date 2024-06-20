import { getKeypairFromFile } from "@solana-developers/helpers";
import { createInitializeMetadataPointerInstruction, createInitializeMintInstruction, ExtensionType, getMintLen, getTokenMetadata, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { createInitializeInstruction, createUpdateFieldInstruction, pack, type TokenMetadata } from "@solana/spl-token-metadata";
import { Connection, Keypair, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";

const lg = console.log;
const connection = new Connection(clusterApiUrl("devnet"));
const payer = await getKeypairFromFile("~/.config/solana/id.json");
lg("payer:", payer.publicKey.toBase58());

const mint = Keypair.generate();
lg("mint:", mint.publicKey.toBase58());

const metadata: TokenMetadata = {
  mint: mint.publicKey,//use mint as metadata account!
  name: "Dragon Gold Coin",
  symbol: "DRGG",
  uri: "https://peach-tough-crayfish-991.mypinata.cloud/ipfs/QmWRWwgczECwe7hxNn4iAZYqMyouqkV93KSYFvr3WBDeG3",
  additionalMetadata: [
    ["key01", "value01"]
  ]
}//additionalMetadata will be stored online!

const mintSpace = getMintLen([
  ExtensionType.MetadataPointer
])//add all extionsions we need. The array input will be stored inside the mint

const metadataSpace = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

const lamports = await connection.getMinimumBalanceForRentExemption(mintSpace + metadataSpace);

const createAccountTx = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mint.publicKey,
  space: mintSpace,//only mintSpace bcos certain token extensions are required to be implemented on Mint itself!
  lamports,
  programId: TOKEN_2022_PROGRAM_ID
});

const initializeMetadataPointerIx = createInitializeMetadataPointerInstruction(
  mint.publicKey, payer.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID
);
const decimals = 2;
const initializeMintIx = createInitializeMintInstruction(
  mint.publicKey, decimals, payer.publicKey, null, TOKEN_2022_PROGRAM_ID
);

const initializeMetadataIx = createInitializeInstruction({
  mint: mint.publicKey,
  metadata: mint.publicKey,//mint is also the metadata account!
  mintAuthority: payer.publicKey,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  programId: TOKEN_2022_PROGRAM_ID,
  updateAuthority: payer.publicKey,//the authority argument from createInitializeMetadataPointerInstruction() above
});

const updateMetadataField = createUpdateFieldInstruction({
  metadata: mint.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  updateAuthority: payer.publicKey,//the authority argument from createInitializeMetadataPointerInstruction() above
  field: metadata.additionalMetadata[0][0],
  value: metadata.additionalMetadata[0][1]
});

const transaction = new Transaction().add(
  createAccountTx,
  initializeMetadataPointerIx,
  initializeMintIx,
  initializeMetadataIx,
  updateMetadataField
);//argument ORDER is very important!

const sig = await sendAndConfirmTransaction(
  connection, transaction, [payer, mint]
);
lg("sig:", sig);

const chainMetadata = await getTokenMetadata(
  connection, mint.publicKey
);
lg("chainMetadata:", chainMetadata);





