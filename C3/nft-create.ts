import { createGenericFile, createSignerFromKeypair, generateSigner, percentAmount, signerIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";
import { readFile } from "fs/promises";
import "dotenv/config";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi/serializers";

const kp = getKeypairFromEnvironment("SECRET_KEY");

const umi = createUmi(clusterApiUrl('devnet'));

let keypair = umi.eddsa.createKeypairFromSecretKey(kp.secretKey);
const signer = createSignerFromKeypair(umi, keypair);

umi.use(mplTokenMetadata());
umi.use(signerIdentity(signer));

const METADATA_URI = "https://gateway.irys.xyz/5arWvUkN1MTrYjW3FPPebsuBh8VMWtrSGNdNbyuyUjnj";

async function createMyNft() {
    try {
        const mint = generateSigner(umi);

        let tx = createNft(umi, {
            name: "Mountain",
            mint,
            authority: signer,
            sellerFeeBasisPoints: percentAmount(5),
            isCollection: false,
            uri: METADATA_URI
        });

        let result = await tx.sendAndConfirm(umi);

        const signature = base58.deserialize(result.signature);
        console.log("NFT created with signature: ", signature);
    } catch (err) {
        console.error("[createMyNft] Failed with error: ", err);
    }
}

createMyNft();