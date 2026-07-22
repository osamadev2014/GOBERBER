import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Plus, Search, Minus } from "lucide-react";
import { categories, products, type Product } from "@/lib/menu-data";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { GuidedTour, type TourStep } from "@/components/common/GuidedTour";

const TOUR_STEPS: TourStep[] = [
  { id: "add-meal", titleKey: "tourStep1Title", descriptionKey: "tourStep1Desc" },
  { id: "cart", titleKey: "tourStep2Title", descriptionKey: "tourStep2Desc" },
];

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Go Burger" },
      {
        name: "description",
        content:
          "Browse the full Go Burger menu: signature smash burgers, chicken, sides, and shakes.",
      },
      { property: "og:title", content: "Menu — Go Burger" },
      {
        property: "og:description",
        content:
          "Browse the full Go Burger menu: signature smash burgers, chicken, sides, and shakes.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { t, lang } = useT();
  const search = useSearch({ strict: false }) as { q?: string };
  const initialQ = search.q ?? "";
  const navigate = Route.useNavigate();
  const [active, setActive] = useState<string>("signatures");
  const [query, setQuery] = useState(initialQ);

  useEffect(() => {
    if (initialQ !== query) setQuery(initialQ);
  }, [initialQ]);

  const updateQuery = (val: string) => {
    setQuery(val);
    navigate({
      search: { q: val || undefined },
      replace: true,
    });
  };

  useEffect(() => {
    const opts: IntersectionObserverInit = {
      rootMargin: "-30% 0px -60% 0px",
    };
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((e) => e.isIntersecting);
      if (visible?.target.id) setActive(visible.target.id);
    }, opts);
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    return categories.map((c) => ({
      ...c,
      items: filtered.filter((p) => p.category === c.id),
    }));
  }, [filtered]);

  const firstProductId = useMemo(() => {
    for (const c of grouped) {
      if (c.items.length > 0) return c.items[0].id;
    }
    return null;
  }, [grouped]);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6">
      <GuidedTour steps={TOUR_STEPS} alwaysShow />
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            {t("menuEyebrow")}
          </p>
          <h1 className="mt-2 font-display text-5xl text-foreground sm:text-6xl">
            {t("menuTitle")}
          </h1>
        </div>
        <div className="flex w-full items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder={t("menuSearch")}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </header>

      {/* Sticky category bar */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-y border-border/60 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollTo(c.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                active === c.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang === "ar" ? c.nameAr : c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16">
        {grouped.map((c) =>
          c.items.length === 0 ? null : (
            <section key={c.id} id={c.id} className="scroll-mt-32">
              <h2 className="mb-6 font-display text-3xl text-foreground sm:text-4xl">
                {lang === "ar" ? c.nameAr : c.name}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {c.items.map((p) => (
                  <MenuCard key={p.id} product={p} tourId={p.id === firstProductId ? "add-meal" : undefined} />
                ))}
              </div>
            </section>
          ),
        )}
      </div>
    </div>
  );
}

function MenuCard({ product, tourId }: { product: Product; tourId?: string }) {
  const { add, lines, updateQty } = useCart();
  const { t, lang } = useT();
  const line = lines.find((l) => l.product.id === product.id && !l.notes);
  const qty = line?.quantity ?? 0;

  return (
    <article className="group flex overflow-hidden rounded-3xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50">
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-xl text-foreground">
              {lang === "ar" ? product.nameAr : product.name}
            </h3>
            {product.badge && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                {lang === "ar" ? (product.badgeAr ?? product.badge) : product.badge}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "ar" ? product.taglineAr : product.tagline}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl text-primary">
              {price(product.price)}
            </p>
            {product.calories && (
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {product.calories} cal
              </p>
            )}
          </div>

          {qty === 0 ? (
            <button
              onClick={() => add(product)}
              {...(tourId ? { "data-tour-id": tourId } : {})}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4" strokeWidth={3} /> إضافة
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground">
              <button
                onClick={() => line && updateQty(line.id, qty - 1)}
                aria-label="Decrease"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary-foreground/10"
              >
                <Minus className="h-4 w-4" strokeWidth={3} />
              </button>
              <span className="min-w-[1.5rem] text-center font-bold">
                {qty}
              </span>
              <button
                onClick={() => line && updateQty(line.id, qty + 1)}
                aria-label="Increase"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary-foreground/10"
              >
                <Plus className="h-4 w-4" strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
      <Link
        to="/menu/$slug"
        params={{ slug: product.slug }}
        className="relative aspect-square w-36 shrink-0 overflow-hidden sm:w-44"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
    </article>
  );
}
