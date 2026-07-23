import { Circle } from "react-leaflet";
import { DEFAULT_STORE_DELIVERY_RADIUS_KM } from "@/config/delivery";
import type { Store } from "@/data/stores";

const COVERAGE_STYLE = {
  color: "#ea580c",
  fillColor: "#ea580c",
  fillOpacity: 0.12,
  opacity: 0.55,
  weight: 2,
} as const;

const RADIUS_METERS = DEFAULT_STORE_DELIVERY_RADIUS_KM * 1000;

interface StoreCoverageCirclesProps {
  stores: readonly Store[];
}

export function StoreCoverageCircles({ stores }: StoreCoverageCirclesProps) {
  return (
    <>
      {stores.map((store) => (
        <Circle
          key={store.id}
          center={[store.location.lat, store.location.lng]}
          radius={RADIUS_METERS}
          pathOptions={COVERAGE_STYLE}
          interactive={false}
        />
      ))}
    </>
  );
}
