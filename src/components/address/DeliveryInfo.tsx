import { Store, MapPin, Truck } from "lucide-react";
import type { NearestStoreResult } from "@/lib/delivery";

interface DeliveryInfoProps {
  info: NearestStoreResult | null;
}

export function DeliveryInfo({ info }: DeliveryInfoProps) {
  if (!info) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Store className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">أقرب فرع</p>
            <p className="text-sm font-semibold text-foreground">
              {info.nearestStore.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">يبعد</p>
            <p className="text-sm font-semibold text-foreground">
              {info.distanceKm} كم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              info.withinDeliveryRange ? "bg-emerald-500/10" : "bg-amber-500/10"
            }`}
          >
            <Truck
              className={`h-4 w-4 ${
                info.withinDeliveryRange ? "text-emerald-500" : "text-amber-500"
              }`}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">حالة التوصيل</p>
            <p
              className={`text-sm font-semibold ${
                info.withinDeliveryRange ? "text-emerald-500" : "text-amber-500"
              }`}
            >
              {info.withinDeliveryRange
                ? "داخل نطاق التوصيل"
                : "خارج نطاق التوصيل"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
