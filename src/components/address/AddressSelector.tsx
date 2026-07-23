import { useEffect, useRef, useState } from "react";
import { Home, Map, MapPin, X } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Choice } from "@/components/ui/choice";
import { LocationPicker } from "./LocationPicker";

interface AddressEntry {
  id: string;
  Icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  addrKey?: string;
}

const DEFAULT_ADDRESSES: AddressEntry[] = [
  { id: "home", Icon: Home, labelKey: "checkoutHome", addrKey: "checkoutHomeAddr" },
  { id: "work", Icon: MapPin, labelKey: "checkoutWork", addrKey: "checkoutWorkAddr" },
];

export interface AddressSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export function AddressSelector({ value, onChange }: AddressSelectorProps) {
  const { t } = useT();
  const [addresses, setAddresses] = useState<AddressEntry[]>(DEFAULT_ADDRESSES);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddr, setNewAddr] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const hasOpenedMapRef = useRef(false);

  const isMap = value === "map";

  useEffect(() => {
    if (isMap && !hasOpenedMapRef.current && mapRef.current) {
      hasOpenedMapRef.current = true;
      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
    }
  }, [isMap]);

  const choices: AddressEntry[] = [
    ...addresses,
    { id: "map", Icon: Map, labelKey: "checkoutMap", addrKey: "checkoutMapAddr" },
  ];

  return (
    <div className="space-y-3">
      {choices.map(({ id, Icon, labelKey, addrKey }) => (
        <Choice
          key={id}
          active={value === id}
          onClick={() => onChange(id)}
        >
          <Icon className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{t(labelKey as any)}</p>
            {addrKey && (
              <p className="truncate text-sm text-muted-foreground">{t(addrKey as any)}</p>
            )}
          </div>
        </Choice>
      ))}

      <div
        ref={mapRef}
        style={{ gridTemplateRows: isMap ? "1fr" : "0fr" }}
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`transition-opacity duration-300 ${isMap ? "opacity-100" : "opacity-0"}`}>
            <div className="pt-2">
              <LocationPicker />
            </div>
          </div>
        </div>
      </div>

      {!isMap && (
        addingAddress ? (
          <div className="rounded-2xl border border-primary bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">{t("checkoutAddNew")}</p>
              <button onClick={() => { setAddingAddress(false); setNewLabel(""); setNewAddr(""); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder={t("checkoutNewLabel")}
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <input
              value={newAddr}
              onChange={(e) => setNewAddr(e.target.value)}
              placeholder={t("checkoutNewAddr")}
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              disabled={!newLabel.trim() || !newAddr.trim()}
              onClick={() => {
                const id = `custom-${Date.now()}`;
                setAddresses((prev) => [...prev, { id, Icon: MapPin, labelKey: "checkoutHome", addrKey: "checkoutHomeAddr" }]);
                onChange(id);
                setAddingAddress(false);
                setNewLabel("");
                setNewAddr("");
              }}
              className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {t("checkoutSaveAddr")}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingAddress(true)}
            className="w-full rounded-2xl border border-dashed border-border/60 px-4 py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary"
          >
            {t("checkoutAddNew")}
          </button>
        )
      )}
    </div>
  );
}
