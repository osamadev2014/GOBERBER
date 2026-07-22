import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your bag — Go Burger" },
      {
        name: "description",
        content: "Review your Go Burger order and head to checkout.",
      },
      { property: "og:title", content: "Your bag — Go Burger" },
      {
        property: "og:description",
        content: "Review your Go Burger order and head to checkout.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const {
    lines,
    updateQty,
    remove,
    subtotal,
    extrasTotal,
    coupon,
    setCoupon,
    discount,
    deliveryFee,
    total,
  } = useCart();
  const { t, lang } = useT();
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    if (couponInput.toUpperCase() === "EMBER20") {
      setCoupon("EMBER20");
      setCouponFeedback("EMBER20");
    } else {
      setCoupon(null);
      setCouponFeedback(couponInput.toUpperCase());
    }
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-foreground">
          {t("cartEmpty")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("cartEmptyDesc")}
        </p>
        <Link
          to="/menu"
          className="ember-glow mt-8 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          {t("cartBrowse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-5xl text-foreground sm:text-6xl">
        {t("cartTitle")}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {lines.length} {lines.length === 1 ? t("cartItems") : t("cartItemsPlural")} · {t("cartReady")}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Lines */}
        <ul className="space-y-3">
          {lines.map((l) => (
            <li
              key={l.id}
              className="flex gap-4 rounded-3xl border border-border/60 bg-card p-4 transition-all"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                <img
                  src={l.product.image}
                   alt={lang === "ar" ? l.product.nameAr : l.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg text-foreground">
                       {lang === "ar" ? l.product.nameAr : l.product.name}
                    </h3>
                    {l.extras && l.extras.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {l.extras.map((e) => e.label).join(" · ")}
                      </p>
                    )}
                    {l.mods && l.mods.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {l.mods.join(" · ")}
                      </p>
                    )}
                    {l.notes && (
                      <p className="mt-1 text-xs italic text-muted-foreground">
                        "{l.notes}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(l.id)}
                    aria-label="Remove"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between pt-3">
                  <div className="flex items-center gap-2 rounded-full border border-border/60 p-0.5">
                    <button
                      onClick={() => updateQty(l.id, l.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm font-bold">
                      {l.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(l.id, l.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-display text-xl text-primary">
                    {price((l.product.price + (l.extras?.reduce((s, e) => s + e.price, 0) ?? 0)) * l.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}

          <div className="mt-6 rounded-3xl border border-border/60 bg-card p-5">
            <label className="text-xs uppercase tracking-[0.2em] text-primary">
              {t("cartOrderNotes")}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={t("cartNotesPlaceholder")}
              className="mt-2 w-full rounded-xl border border-border/60 bg-background p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-2xl">{t("cartSummary")}</h2>

            {/* Coupon */}
            <div className="mt-5 flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-full border border-border/60 bg-background px-3">
                <Tag className="h-4 w-4 text-primary" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder={t("cartCoupon")}
                  className="flex-1 bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                className="rounded-full bg-secondary px-4 text-sm font-semibold hover:bg-accent"
              >
                {t("cartApply")}
              </button>
            </div>
            {couponFeedback && (
              <p
                className={`mt-2 text-xs ${
                  coupon ? "text-primary" : "text-destructive"
                }`}
              >
                {coupon
                  ? t("cartCouponApplied")
                  : t("cartCouponInvalid")}
              </p>
            )}

            <dl className="mt-6 space-y-2 text-sm">
              <Row label={t("cartSubtotal")} value={price(subtotal)} />
              {extrasTotal > 0 && (
                <Row label={t("cartExtras")} value={price(extrasTotal)} />
              )}
              {discount > 0 && (
                <Row
                  label={t("cartDiscount")}
                  value={`-${price(discount)}`}
                  accent
                />
              )}
              <Row
                label={t("cartDelivery")}
                value={deliveryFee === 0 ? t("cartFree") : price(deliveryFee)}
                accent={deliveryFee === 0}
              />
              {deliveryFee > 0 && (
                <p className="text-xs text-muted-foreground">
                  {t("cartFreeHint", { amount: price(25 - subtotal) })}
                </p>
              )}
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-border/60 pt-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("cartTotal")}
              </span>
              <span className="font-display text-3xl text-primary">
                {price(total)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="ember-glow mt-6 flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              {t("cartCheckout")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/menu"
              className="mt-2 flex items-center justify-center py-3 text-sm text-muted-foreground hover:text-foreground"
            >
              {t("cartAddMore")}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "font-semibold text-primary" : "text-foreground"}>
        {value}
      </dd>
    </div>
  );
}
