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

const IMAGE_FILE = "./mountain-3.jpg";

export async function uploadImage() {

    try {
        console.log("Uploading image...");
        const img = await readFile(IMAGE_FILE);
        const imgConverted = createGenericFile(new Uint8Array(img), "image/jpg");

        const [myUri] = await umi.uploader.upload([imgConverted]);
        console.log("Uploaded image to: ", myUri);
    } catch (err){
        console.error("[uploadImage] Failed with error: ", err);
    }

}

uploadImage();