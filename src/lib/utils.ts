import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const RIYAL = "﷼";

export function price(amount: number): string {
  return `${amount.toFixed(2)} ${RIYAL}`;
}

export function priceShort(amount: number): string {
  return `${amount.toFixed(0)} ${RIYAL}`;
}
