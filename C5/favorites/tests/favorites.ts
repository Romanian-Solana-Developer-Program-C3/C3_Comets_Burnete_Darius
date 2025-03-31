import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Favorites } from "../target/types/favorites";
import { PublicKey } from "@solana/web3.js";

describe("favorites", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const user = (provider.wallet as anchor.Wallet).payer;

  const program = anchor.workspace.favorites as Program<Favorites>;

  it("Is initialized!", async () => {
    const favoritesPdaAndBump = PublicKey.findProgramAddressSync(
      [Buffer.from("favorites"), user.publicKey.toBuffer()],
      program.programId
    );
    const favoritesPda = favoritesPdaAndBump[0];
    const PdaState = await program.account.favorites.fetch(favoritesPda);
    console.log(favoritesPdaAndBump);
  });
});
