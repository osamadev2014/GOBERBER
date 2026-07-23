import { Marker } from "react-leaflet";
import L from "leaflet";
import type { Store } from "@/data/stores";

const STORE_MARKER = new L.DivIcon({
  className: "",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;">
    <div style="width:10px;height:10px;background:#6b7280;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface StoreMarkersProps {
  stores: readonly Store[];
}

export function StoreMarkers({ stores }: StoreMarkersProps) {
  return (
    <>
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={[store.location.lat, store.location.lng]}
          icon={STORE_MARKER}
          interactive={false}
        />
      ))}
    </>
  );
}
