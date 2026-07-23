import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Truck,
  Wallet,
  Bike,
  Store,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { AddressSelector } from "@/components/address";
import { Choice } from "@/components/ui/choice";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Go Burger" },
      {
        name: "description",
        content: "Complete your Go Burger order: address, payment, and delivery time.",
      },
      { property: "og:title", content: "Checkout — Go Burger" },
      {
        property: "og:description",
        content: "Complete your Go Burger order: address, payment, and delivery time.",
      },
    ],
  }),
  component: CheckoutPage,
});

const STEPS_KEYS = ["checkoutAddress", "checkoutOption", "checkoutPayment", "checkoutReview"] as const;

function CheckoutPage() {
  const { lines, subtotal, extrasTotal, discount, deliveryFee, total, coupon, clear } = useCart();
  const { t, lang } = useT();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("home");
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery");
  const [time, setTime] = useState("asap");
  const [payment, setPayment] = useState("card");
  const [placed, setPlaced] = useState(false);

  const fee = delivery === "pickup" ? 0 : deliveryFee;
  const finalTotal = delivery === "pickup"
    ? Math.max(0, subtotal + extrasTotal - discount)
    : total;

  if (placed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        <h1 className="mt-6 font-display text-5xl">{t("orderPlaced")}</h1>
        <p className="mt-3 text-muted-foreground">
          {t("orderPlacedDesc")}
        </p>
        <Link
          to="/"
          className="ember-glow mt-8 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          {t("orderBackHome")}
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-4xl">{t("cartEmpty")}</h1>
        <Link
          to="/menu"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          {t("cartBrowse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-5xl text-foreground">{t("checkoutTitle")}</h1>

      {/* Stepper */}
      <ol className="mt-8 flex flex-wrap gap-2">
        {STEPS_KEYS.map((key, i) => (
          <li key={key} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/20 text-xs">
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {t(key)}
            </button>
            {i < STEPS_KEYS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {step === 0 && (
            <Panel title={t("checkoutAddress")}>
              <AddressSelector value={address} onChange={setAddress} />
            </Panel>
          )}

          {step === 1 && (
            <>
              <Panel title={t("checkoutOption")}>
                <Choice
                  active={delivery === "delivery"}
                  onClick={() => setDelivery("delivery")}
                >
                  <Bike className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{t("checkoutDelivery")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("checkoutDeliveryTime")} · {fee === 0 ? t("cartFree") : price(fee)}
                    </p>
                  </div>
                </Choice>
                <Choice
                  active={delivery === "pickup"}
                  onClick={() => setDelivery("pickup")}
                >
                  <Store className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{t("checkoutPickup")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("checkoutPickupTime")}
                    </p>
                  </div>
                </Choice>
              </Panel>

              <Panel title={t("checkoutTime")}>
                <Choice active={time === "asap"} onClick={() => setTime("asap")}>
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{t("checkoutASAP")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("checkoutASAPDesc")}
                    </p>
                  </div>
                </Choice>
                <Choice
                  active={time === "schedule"}
                  onClick={() => setTime("schedule")}
                >
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{t("checkoutSchedule")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("checkoutScheduleDesc")}
                    </p>
                  </div>
                </Choice>
              </Panel>
            </>
          )}

          {step === 2 && (
            <Panel title={t("checkoutPayment")}>
              <Choice
                active={payment === "card"}
                onClick={() => setPayment("card")}
              >
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{t("checkoutCard")}</p>
                  <p className="text-sm text-muted-foreground">{t("checkoutCardDesc")}</p>
                </div>
              </Choice>
              <Choice
                active={payment === "wallet"}
                onClick={() => setPayment("wallet")}
              >
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{t("checkoutWallet")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("checkoutWalletDesc")}
                  </p>
                </div>
              </Choice>
              <Choice
                active={payment === "cash"}
                onClick={() => setPayment("cash")}
              >
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{t("checkoutCash")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("checkoutCashDesc")}
                  </p>
                </div>
              </Choice>
            </Panel>
          )}

          {step === 3 && (
            <Panel title={t("checkoutReview")}>
              <div className="space-y-3">
                {lines.map((l) => (
                  <div
                    key={l.id}
                    className="flex justify-between text-sm text-muted-foreground"
                  >
                    <div className="text-foreground">
                      <span>{l.quantity}× {lang === "ar" ? l.product.nameAr : l.product.name}</span>
                      {l.extras && l.extras.length > 0 && (
                        <span className="ml-1 text-xs">
                          ({l.extras.map((e) => e.label).join(", ")})
                        </span>
                      )}
                    </div>
                    <span>
                      {price((l.product.price + (l.extras?.reduce((s, e) => s + e.price, 0) ?? 0)) * l.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1 border-t border-border/60 pt-4 text-sm text-muted-foreground">
                <p>
                  <span className="text-foreground">{t("checkoutReviewDelivery")}</span>
                  {delivery === "delivery"
                    ? address === "map"
                      ? t("checkoutMapSelected")
                      : address === "home"
                        ? t("checkoutHomeAddr")
                        : address === "work"
                          ? t("checkoutWorkAddr")
                          : "Selected address"
                    : t("checkoutReviewPickup")}
                </p>
                <p>
                  <span className="text-foreground">{t("checkoutTime")}: </span>
                  {time === "asap" ? t("checkoutReviewASAP") : t("checkoutReviewScheduled")}
                </p>
                <p>
                  <span className="text-foreground">{t("checkoutPayment")}: </span>
                  {payment === "card"
                    ? t("checkoutCard")
                    : payment === "wallet"
                      ? t("checkoutWallet")
                      : t("checkoutCash")}
                </p>
              </div>
            </Panel>
          )}

          <div className="flex justify-between gap-3">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full border border-border/60 px-6 py-3 text-sm font-semibold hover:bg-accent"
              >
                {t("checkoutBack")}
              </button>
            ) : (
              <Link
                to="/cart"
                className="rounded-full border border-border/60 px-6 py-3 text-sm font-semibold hover:bg-accent"
              >
                {t("checkoutBackToBag")}
              </Link>
            )}
            {step < STEPS_KEYS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="ember-glow flex-1 rounded-full bg-primary py-3 font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                {t("checkoutContinue")}
              </button>
            ) : (
              <button
                onClick={() => {
                  clear();
                  setPlaced(true);
                }}
                className="ember-glow flex-1 rounded-full bg-primary py-3 font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                {t("checkoutPlaceOrder")} · {price(finalTotal)}
              </button>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-2xl">{t("cartTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center gap-3 text-sm">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={l.product.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{lang === "ar" ? l.product.nameAr : l.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {l.quantity}
                    </p>
                  </div>
                  <p className="font-display text-primary">
                    {price((l.product.price + (l.extras?.reduce((s, e) => s + e.price, 0) ?? 0)) * l.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-border/60 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("cartSubtotal")}</dt>
                <dd>{price(subtotal)}</dd>
              </div>
              {extrasTotal > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("cartExtras")}</dt>
                  <dd>{price(extrasTotal)}</dd>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <dt>{t("cartDiscount")}</dt>
                  <dd>-{price(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("cartDelivery")}</dt>
                <dd>{fee === 0 ? t("cartFree") : price(fee)}</dd>
              </div>
              <div className="mt-2 flex items-baseline justify-between border-t border-border/60 pt-3">
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("cartTotal")}
                </dt>
                <dd className="font-display text-2xl text-primary">
                  {price(finalTotal)}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-6">
      <h2 className="mb-4 font-display text-xl">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
