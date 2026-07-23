import { useState } from "react";
import { MiniMap } from "./MiniMap";
import { DeliveryInfo } from "./DeliveryInfo";
import { useDeliveryInfo } from "@/hooks/useDeliveryInfo";

export interface Coords {
  lat: number;
  lng: number;
}

const RIYADH_CENTER: Coords = { lat: 24.7136, lng: 46.6753 };

export interface LocationPickerProps {
  value?: Coords;
  onChange?: (coords: Coords) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function LocationPicker({
  value,
  onChange,
  disabled = false,
  readOnly = false,
}: LocationPickerProps) {
  const [internalCoords, setInternalCoords] = useState<Coords>(RIYADH_CENTER);

  const coords = value ?? internalCoords;
  const deliveryInfo = useDeliveryInfo(coords);

  const handleCoordsChange = (newCoords: Coords) => {
    if (readOnly || disabled) return;
    setInternalCoords(newCoords);
    onChange?.(newCoords);
  };

  return (
    <div className="space-y-3">
      <MiniMap
        coords={coords}
        onCoordsChange={handleCoordsChange}
        disabled={disabled || readOnly}
      />

      <DeliveryInfo info={deliveryInfo} />
    </div>
  );
}
