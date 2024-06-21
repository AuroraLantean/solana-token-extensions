import { getKeypairFromFile } from "@solana-developers/helpers";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";

const lg = console.log;
const connection = new Connection(clusterApiUrl("devnet"));
//const connection = new Connection(your_solana_node_url);
const payer = await getKeypairFromFile("~/.config/solana/id.json");
lg("payer:", payer.publicKey.toBase58());
/* import bs58 from "bs58";
const privateKey = new Uint8Array(bs58.decode(process.env['PRIVATE_KEY']));
const account = Keypair.fromSecretKey(privateKey)
*/

// Transfer SOL
const dest = new PublicKey("Address");
//const destKP = Keypair.generate();
const amountInSol = 0.001;
const transfer_txn = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: dest,
    lamports: LAMPORTS_PER_SOL * amountInSol,
  })
);
const transfer_sig = await sendAndConfirmTransaction(
  connection, transfer_txn, [payer]
);
lg("transfer_sig:", transfer_sig);

