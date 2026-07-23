import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { MapPin, AlertTriangle } from "lucide-react";
import L from "leaflet";
import { BoundedMapEvents } from "./BoundedMapEvents";
import { StoreMarkers } from "./StoreMarkers";
import { StoreCoverageCircles } from "./StoreCoverageCircles";
import { getStores } from "@/lib/stores";
import type { Coords } from "./LocationPicker";

const CENTER_MARKER = new L.DivIcon({
  className: "",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;">
    <div style="width:16px;height:16px;background:#ea580c;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface MiniMapProps {
  coords: Coords;
  onCoordsChange: (coords: Coords) => void;
  disabled?: boolean;
}

export function MiniMap({
  coords,
  onCoordsChange,
  disabled,
}: MiniMapProps) {
  const [mounted, setMounted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const warningTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoveEnd = useCallback(
    (newCoords: Coords) => {
      onCoordsChange(newCoords);
    },
    [onCoordsChange],
  );

  const handleInvalidMove = useCallback(() => {
    setShowWarning(true);
    clearTimeout(warningTimer.current);
    warningTimer.current = setTimeout(() => setShowWarning(false), 2500);
  }, []);

  useEffect(() => {
    return () => clearTimeout(warningTimer.current);
  }, []);

  if (!mounted) {
    return (
      <div className="relative h-[200px] overflow-hidden rounded-2xl border border-border/60 sm:h-[260px]">
        <div className="absolute inset-0 animate-pulse bg-muted" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="h-8 w-8 text-muted-foreground/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60">
      <div className="h-[200px] sm:h-[260px]">
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={15}
          zoomControl={false}
          scrollWheelZoom={!disabled}
          dragging={!disabled}
          doubleClickZoom={!disabled}
          touchZoom={!disabled}
          keyboard={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <StoreCoverageCircles stores={getStores()} />
          <StoreMarkers stores={getStores()} />
          <Marker
            position={[coords.lat, coords.lng]}
            icon={CENTER_MARKER}
            interactive={false}
          />
          {!disabled && (
            <BoundedMapEvents
              onMoveEnd={handleMoveEnd}
              onInvalidMove={handleInvalidMove}
              lastValid={coords}
            />
          )}
        </MapContainer>
      </div>

      {showWarning && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center gap-2 rounded-xl bg-amber-500/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>يمكن اختيار مواقع داخل المملكة العربية السعودية فقط.</span>
        </div>
      )}

      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 shadow-md backdrop-blur-sm">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs text-muted-foreground">
          اختر موقع التوصيل على الخريطة
        </span>
      </div>
    </div>
  );
}
