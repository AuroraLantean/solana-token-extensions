import { getKeypairFromFile } from "@solana-developers/helpers";
import { Connection, Keypair, LAMPORTS_PER_SOL, type ParsedAccountData, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
import { createTransferInstruction, getOrCreateAssociatedTokenAccount, TokenInstruction, transfer } from "@solana/spl-token"

const lg = console.log;
const connection = new Connection(clusterApiUrl("devnet"));//, "confirmed"
//const connection = new Connection(your_solana_node_url);
const payer = await getKeypairFromFile("~/.config/solana/id.json");
lg("payer:", payer.publicKey.toBase58());
/* import bs58 from "bs58";
const privateKey = new Uint8Array(bs58.decode(process.env['PRIVATE_KEY']));
const account = Keypair.fromSecretKey(privateKey)

//https://solana.com/developers/cookbook/transactions/send-tokens
const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,  LAMPORTS_PER_SOL, );
await connection.confirmTransaction(fromAirdropSignature);
*/

//https://www.quicknode.com/guides/solana-development/spl-tokens/how-to-transfer-spl-tokens-on-solana
const mintAddr = "777";
const toAddr = "222";
const mint = new PublicKey(mintAddr);
const dest = new PublicKey(toAddr);
const amount = 10;

lg(`Sending ${amount} ${(mintAddr)} from ${(payer.publicKey.toString())} to ${(toAddr)}.`)
//Step 1: Get/Make Source Token Account
lg("1 - Get/Make Source Token Account");
const sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection, payer, mint, payer.publicKey);
lg(`    Source Account: ${sourceAccount.address.toString()}`);


//Step 2: Get Destination Token Account
lg("2 - Get Destination Token Account");
const destTokAcct = await getOrCreateAssociatedTokenAccount(
    connection, payer, mint, dest);
lg(`    Destination Account: ${destTokAcct.address.toString()}`);

//Step 3: Fetch Decimals for Mint
const info = await connection.getParsedAccountInfo(mint);
const decimals = (info.value?.data as ParsedAccountData).parsed.info.decimals as number;
lg(`3 - Fetch Decimals for Mint: ${mintAddr}`);
lg(`    Number of Decimals: ${decimals}`);

//Step 4: Make and Send Transaction
lg("4 - Make and Send Transaction");
const tx = new Transaction();
tx.add(createTransferInstruction(
    sourceAccount.address,
    destTokAcct.address,
    payer.publicKey,
    amount * 10 ** decimals
))

const latestBlockHash = await connection.getLatestBlockhash('confirmed');
tx.recentBlockhash = latestBlockHash.blockhash;    
const signature = await sendAndConfirmTransaction(connection,tx,[payer]);
lg(
    '\x1b[32m', //Green Text
    "   Transaction Success!🎉",
    `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
);