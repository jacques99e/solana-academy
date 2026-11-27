import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  type TransactionSignature,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import type { WalletContextState } from "@solana/wallet-adapter-react";

let devnetConnection: Connection | undefined;

export class DevnetFaucetClosedError extends Error {
  constructor() {
    super("Le faucet du RPC Devnet est fermé. Utilise le faucet officiel Solana.");
    this.name = "DevnetFaucetClosedError";
  }
}

export function getSolanaConnection(): Connection {
  if (!devnetConnection) {
    devnetConnection = new Connection(clusterApiUrl("devnet"), "confirmed");
  }

  return devnetConnection;
}

export async function requestAirdrop(publicKey: PublicKey): Promise<string> {
  const connection = getSolanaConnection();
  const latestBlockhash = await connection.getLatestBlockhash("confirmed");
  let signature: string;
  try {
    signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/faucet is closed|code["':\s]*410/i.test(message)) {
      throw new DevnetFaucetClosedError();
    }
    throw error;
  }

  const confirmation = await connection.confirmTransaction(
    { ...latestBlockhash, signature },
    "confirmed",
  );

  if (confirmation.value.err) {
    throw new Error(
      `La transaction d'airdrop a échoué : ${JSON.stringify(confirmation.value.err)}`,
    );
  }

  return signature;
}

export async function getBalance(publicKey: PublicKey): Promise<number> {
  const lamports = await getSolanaConnection().getBalance(publicKey, "confirmed");
  return lamports / LAMPORTS_PER_SOL;
}

export type RecentTransaction = {
  signature: TransactionSignature;
  slot: number;
  blockTime: number | null;
};

export async function getRecentTransactions(
  publicKey: PublicKey,
  limit = 10,
): Promise<RecentTransaction[]> {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("Le nombre de transactions demandé doit être compris entre 1 et 100.");
  }

  const signatures = await getSolanaConnection().getSignaturesForAddress(
    publicKey,
    { limit },
    "confirmed",
  );

  return signatures
    .filter((transaction) => transaction.err === null)
    .map(({ signature, slot, blockTime }) => ({
      signature,
      slot,
      blockTime: blockTime ?? null,
    }));
}

export async function signMessage(
  wallet: Pick<WalletContextState, "signMessage">,
  message: string,
): Promise<Uint8Array> {
  if (!wallet.signMessage) {
    throw new Error("Le wallet connecté ne prend pas en charge la signature de message.");
  }

  return wallet.signMessage(new TextEncoder().encode(message));
}

const ENREGISTRER_DIPLOME_DISCRIMINATOR = Buffer.from([
  132, 192, 250, 239, 4, 164, 221, 246,
]);
const DIPLOME_ACCOUNT_DISCRIMINATOR = Buffer.from([
  50, 46, 98, 223, 93, 79, 103, 68,
]);

export type DiplomaStatus = {
  address: PublicKey;
  exists: boolean;
  walletMatches: boolean;
  niveau1Valide: boolean;
};

function getAcademyProgramId(): PublicKey {
  const programIdValue = process.env.NEXT_PUBLIC_SOLANA_ACADEMY_PROGRAM_ID;
  if (!programIdValue) {
    throw new Error(
      "Le programme n'est pas configuré. Définis NEXT_PUBLIC_SOLANA_ACADEMY_PROGRAM_ID après le déploiement.",
    );
  }

  try {
    return new PublicKey(programIdValue);
  } catch {
    throw new Error("NEXT_PUBLIC_SOLANA_ACADEMY_PROGRAM_ID n'est pas une adresse valide.");
  }
}

function deriveDiplomaAddress(
  walletPublicKey: PublicKey,
  programId: PublicKey,
): PublicKey {
  const [diplomePda] = PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("diplome"), walletPublicKey.toBuffer()],
    programId,
  );
  return diplomePda;
}

export async function getDiplomaStatus(
  walletPublicKey: PublicKey,
): Promise<DiplomaStatus> {
  const programId = getAcademyProgramId();
  const address = deriveDiplomaAddress(walletPublicKey, programId);
  const accountInfo = await getSolanaConnection().getAccountInfo(
    address,
    "confirmed",
  );

  if (!accountInfo) {
    return {
      address,
      exists: false,
      walletMatches: false,
      niveau1Valide: false,
    };
  }

  if (!accountInfo.owner.equals(programId)) {
    throw new Error("Le compte du diplôme n'appartient pas au programme attendu.");
  }

  const data = accountInfo.data;
  const expectedSize = DIPLOME_ACCOUNT_DISCRIMINATOR.length + 32 + 1;
  if (
    data.length !== expectedSize ||
    !data.subarray(0, DIPLOME_ACCOUNT_DISCRIMINATOR.length).equals(
      DIPLOME_ACCOUNT_DISCRIMINATOR,
    )
  ) {
    throw new Error("Les données du compte diplôme ne correspondent pas au format attendu.");
  }

  const storedWallet = new PublicKey(
    data.subarray(DIPLOME_ACCOUNT_DISCRIMINATOR.length, expectedSize - 1),
  );
  const niveau1Valide = data[expectedSize - 1];
  if (niveau1Valide !== 0 && niveau1Valide !== 1) {
    throw new Error("Le statut du diplôme contient une valeur booléenne invalide.");
  }

  return {
    address,
    exists: true,
    walletMatches: storedWallet.equals(walletPublicKey),
    niveau1Valide: niveau1Valide === 1,
  };
}

export async function registerDiploma(
  publicKey: PublicKey,
  sendTransaction: WalletContextState["sendTransaction"],
): Promise<{ signature: TransactionSignature; status: DiplomaStatus }> {
  const programId = getAcademyProgramId();
  const connection = getSolanaConnection();
  const diplomePda = deriveDiplomaAddress(publicKey, programId);
  const instruction = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: publicKey, isSigner: true, isWritable: true },
      { pubkey: diplomePda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: ENREGISTRER_DIPLOME_DISCRIMINATOR,
  });
  const transaction = new Transaction().add(instruction);
  const latestBlockhash = await connection.getLatestBlockhash("confirmed");

  transaction.feePayer = publicKey;
  transaction.recentBlockhash = latestBlockhash.blockhash;

  const signature = await sendTransaction(transaction, connection);
  const confirmation = await connection.confirmTransaction(
    { ...latestBlockhash, signature },
    "confirmed",
  );

  if (confirmation.value.err) {
    throw new Error(
      `L'enregistrement du diplôme a échoué : ${JSON.stringify(confirmation.value.err)}`,
    );
  }

  const status = await getDiplomaStatus(publicKey);
  if (!status.exists || !status.walletMatches || !status.niveau1Valide) {
    throw new Error(
      "La transaction est confirmée, mais le compte diplôme ne contient pas la validation attendue.",
    );
  }

  return { signature, status };
}
