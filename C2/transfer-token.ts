import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers"
import { createMint, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, transferChecked } from "@solana/spl-token"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import "dotenv/config"

const MINT = new PublicKey("GuEjDT41qe5KXH3xPXw5QFNdkaUEeMTZ784K19XnARpV");
const SRC = new PublicKey("GgU7Eszs2sNSZEhjBsj8CZybahXEsLYCg1UBi3opHrLX");
const DEST = new PublicKey("91KNNRgVJcjTVFYQ6yPmB2g1YEnvWEyivxk8VrxbYrGd");

async function transferToken(mint: PublicKey, source: PublicKey, dest: PublicKey, amount: number){
    console.log(`Transfering token ${mint}...`)

    const connection = new Connection(clusterApiUrl("devnet"));
    const kp=getKeypairFromEnvironment("SECRET_KEY");

    const sourceAta = getAssociatedTokenAddressSync(mint, source);
    const destAta = await getOrCreateAssociatedTokenAccount(connection, kp, mint, dest);

    const sig = await transferChecked(connection, kp, sourceAta, mint, destAta.address, kp, amount, 9)

    const link = getExplorerLink("tx", sig, "devnet")

    console.log(`Done with link ${link}`);
}

transferToken(MINT, SRC, DEST, 1 * 10**9);