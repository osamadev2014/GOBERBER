import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Flame, ShoppingBag } from "lucide-react";
import { products, extras as EXTRAS, modifiers as MODIFIERS } from "@/lib/menu-data";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/menu/$slug")({
  head: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    const title = p ? `${p.name} — Go Burger` : "Product — Go Burger";
    const desc = p?.tagline ?? "Order from Go Burger.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: typeof products[number] };
  const { add } = useCart();
  const { t, lang } = useT();
  const [qty, setQty] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [mods, setMods] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const extraTotal = extras.reduce(
    (s, id) => s + (EXTRAS.find((e) => e.id === id)?.price ?? 0),
    0,
  );
  const total = (product.price + extraTotal) * qty;

  const sameCategory = products
    .filter((p) => p.id !== product.id && p.category === product.category);
  const otherCategory = products
    .filter((p) => p.id !== product.id && p.category !== product.category);
  const recommendations = [...sameCategory, ...otherCategory].slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6">
      <Link
        to="/menu"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("backToMenu")}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Hero image */}
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover"
              width={800}
              height={800}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="aspect-square w-20 overflow-hidden rounded-xl border border-primary"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Details */}
        <div>
          {product.badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Flame className="h-3 w-3" /> {lang === "ar" ? (product.badgeAr ?? product.badge) : product.badge}
            </span>
          )}
          <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
            {lang === "ar" ? product.nameAr : product.name}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {lang === "ar" ? product.taglineAr : product.tagline}
          </p>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="font-display text-4xl text-primary">
              {price(product.price)}
            </p>
            {product.calories && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {product.calories} cal{product.protein ? ` · ${product.protein}g protein` : ""}
              </p>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients && (
            <section className="mt-8">
              <h2 className="text-xs uppercase tracking-[0.2em] text-primary">
                {t("ingredients")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {lang === "ar" ? (product.ingredientsAr ?? product.ingredients) : product.ingredients}
              </p>
            </section>
          )}

          {/* Extras */}
          <section className="mt-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-primary">
              {t("addExtras")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXTRAS.map((e) => {
                const active = extras.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() =>
                      setExtras((prev) =>
                        active
                          ? prev.filter((x) => x !== e.id)
                          : [...prev, e.id],
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/60 bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "ar" ? e.labelAr : e.label}{" "}
                    <span className="ml-1 opacity-70">
                      +{price(e.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Modifiers */}
          <section className="mt-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-primary">
              {t("modifiers")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {MODIFIERS.map((m) => {
                const mKey = lang === "ar" ? m.ar : m.en;
                const active = mods.includes(mKey);
                return (
                  <button
                    key={m.en}
                    onClick={() =>
                      setMods((prev) =>
                        active ? prev.filter((x) => x !== mKey) : [...prev, mKey],
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/60 bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mKey}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-6">
            <label className="text-xs uppercase tracking-[0.2em] text-primary">
              {t("specialInstructions")}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={t("specialPlaceholder")}
              className="mt-2 w-full rounded-2xl border border-border/60 bg-card p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </section>

          {/* Quantity + add */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2rem] text-center font-display text-xl">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                const selectedExtras = extras
                  .map((id) => EXTRAS.find((e) => e.id === id))
                  .filter(Boolean) as { id: string; label: string; price: number }[];
                add(product, {
                  quantity: qty,
                  extras: selectedExtras,
                  mods,
                  notes,
                });
              }}
              className="ember-glow inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <ShoppingBag className="h-5 w-5" />
              {t("addToBag")} · {price(total)}
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <section className="mt-24">
        <h2 className="mb-6 font-display text-3xl text-foreground">
          {t("pairsWith")}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {recommendations.map((p) => (
            <Link
              key={p.id}
              to="/menu/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-3xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-base">{lang === "ar" ? p.nameAr : p.name}</h3>
                <p className="mt-1 font-display text-primary">
                  {price(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
