import { STORES } from "@/data/stores";
import type { Store } from "@/data/stores";

export function getStores(): readonly Store[] {
  return STORES;
}
