import { useMemo } from "react";
import type { Coords } from "@/components/address/LocationPicker";
import { findNearestStore } from "@/lib/delivery";
import type { NearestStoreResult } from "@/lib/delivery";
import { getStores } from "@/lib/stores";

export function useDeliveryInfo(coords: Coords): NearestStoreResult | null {
  return useMemo(() => findNearestStore(coords, getStores()), [coords.lat, coords.lng]);
}
