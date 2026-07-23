import type { Coords } from "@/components/address/LocationPicker";
import type { Store } from "@/data/stores";
import { calculateDistance } from "./haversine";
import { DEFAULT_STORE_DELIVERY_RADIUS_KM } from "@/config/delivery";

export interface NearestStoreResult {
  nearestStore: Store;
  distanceKm: number;
  withinDeliveryRange: boolean;
}

export function findNearestStore(
  userLocation: Coords,
  stores: readonly Store[],
  radiusKm: number = DEFAULT_STORE_DELIVERY_RADIUS_KM,
): NearestStoreResult | null {
  const active = stores.filter((s) => s.isActive);
  if (active.length === 0) return null;

  let best: Store | null = null;
  let bestDist = Infinity;

  for (const store of active) {
    const dist = calculateDistance(userLocation, store.location);
    if (dist < bestDist) {
      bestDist = dist;
      best = store;
    }
  }

  return {
    nearestStore: best!,
    distanceKm: bestDist,
    withinDeliveryRange: bestDist <= radiusKm,
  };
}
