import { Wallet, type HDNodeWallet } from "ethers";

const STORAGE_KEY = "xmtp_private_key";

export function generateRandomIdentity(): HDNodeWallet {
  return Wallet.createRandom();
}

export function savePrivateKey(privateKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, privateKey);
}

export function loadPrivateKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function clearPrivateKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getOrCreateIdentity(): HDNodeWallet | Wallet {
  const existingKey = loadPrivateKey();
  
  if (existingKey) {
    return new Wallet(existingKey);
  }
  
  const newWallet = generateRandomIdentity();
  savePrivateKey(newWallet.privateKey);
  return newWallet;
}

export function getWalletAddress(wallet: Wallet | HDNodeWallet): string {
  return wallet.address;
}

