import { useMap, useMapEvents } from "react-leaflet";
import { useCallback, useRef } from "react";
import { isInsideSaudiArabia } from "@/lib/geo";
import type { Coords } from "./LocationPicker";

interface BoundedMapEventsProps {
  onMoveEnd: (coords: Coords) => void;
  onInvalidMove: () => void;
  lastValid: Coords;
}

export function BoundedMapEvents({
  onMoveEnd,
  onInvalidMove,
  lastValid,
}: BoundedMapEventsProps) {
  const map = useMap();
  const lastValidRef = useRef(lastValid);
  lastValidRef.current = lastValid;

  const onMoveEndRef = useRef(onMoveEnd);
  onMoveEndRef.current = onMoveEnd;

  const onInvalidMoveRef = useRef(onInvalidMove);
  onInvalidMoveRef.current = onInvalidMove;

  useMapEvents({
    moveend() {
      const center = map.getCenter();
      const coords: Coords = { lat: center.lat, lng: center.lng };

      if (isInsideSaudiArabia(coords.lat, coords.lng)) {
        onMoveEndRef.current(coords);
      } else {
        onInvalidMoveRef.current();
        map.flyTo(
          [lastValidRef.current.lat, lastValidRef.current.lng],
          map.getZoom(),
          { duration: 0.8 },
        );
      }
    },
  });

  return null;
}
