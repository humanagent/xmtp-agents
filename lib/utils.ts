import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MiniKit } from "@worldcoin/minikit-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(address: string): string {
  if (!address || address.length < 10) {
    return address;
  }
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function isWorldApp(): boolean {
  return MiniKit.isInstalled();
}
