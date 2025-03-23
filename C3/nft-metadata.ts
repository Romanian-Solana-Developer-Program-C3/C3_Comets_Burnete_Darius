import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";
import { readFile } from "fs/promises";
import "dotenv/config";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const kp = getKeypairFromEnvironment("SECRET_KEY");

const umi = createUmi(clusterApiUrl('devnet'));

let keypair = umi.eddsa.createKeypairFromSecretKey(kp.secretKey);
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

const IMG_URI = "https://gateway.irys.xyz/6ApNYRX3f265YNCyyF2T7DZVcrHqqgodt9JAhp8QnHdo";

async function uploadMetadata() {
    try {
        const metadata = {
            name: "Mountain",
            symbol: "MNTN",
            description: "A beautiful mountain",
            image: IMG_URI,
            attributes: [
                {
                    trait_type: "Height",
                    value: "1000m"
                },
                {
                    trait_type: "Location",
                    value: "Nepal"
                }
            ],
            properties: {
                files: [
                    {
                        type: "image/jpg", uri: IMG_URI
                    }
                ]
            }
        };

        const metadataUri = await umi.uploader.uploadJson([metadata]);
        console.log("Uploaded metadata to: ", metadataUri);
    } catch (err) {
        console.error("[uploadMetadata] Failed with error: ", err);
    }
}

uploadMetadata();