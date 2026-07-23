import { Check } from "lucide-react";

export function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-2xl border p-4 text-right transition-colors ${
        active
          ? "border-primary bg-primary/10"
          : "border-border/60 bg-background hover:border-border"
      }`}
    >
      {children}
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border"
        }`}
      >
        {active && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </button>
  );
}
