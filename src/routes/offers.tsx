import { createFileRoute, Link } from "@tanstack/react-router";
import { offers } from "@/lib/menu-data";
import { ArrowRight, Ticket } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers — Go Burger" },
      {
        name: "description",
        content: "Current deals, promo codes, and loyalty perks from Go Burger.",
      },
      { property: "og:title", content: "Offers — Go Burger" },
      {
        property: "og:description",
        content: "Current deals, promo codes, and loyalty perks from Go Burger.",
      },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const { t, lang } = useT();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Deals & drops
        </p>
        <h1 className="mt-3 font-display text-6xl">{t("offersTitle")}</h1>
      </header>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {offers.map((o) => (
          <div
            key={o.id}
            className="relative flex overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6"
          >
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {t("offerLabel")}
              </p>
              <h2 className="mt-2 font-display text-3xl">{lang === "ar" ? o.titleAr : o.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {lang === "ar" ? o.subtitleAr : o.subtitle}
              </p>
              <Link
                to="/menu"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                {t("heroOrderNow")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Ticket className="h-16 w-16 text-primary/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
