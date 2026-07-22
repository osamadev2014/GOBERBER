import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Flame,
  Plus,
  Sparkles,
  Star,
  Truck,
  Check,
} from "lucide-react";
import { useState } from "react";
import heroBurger from "@/assets/hero-burger.jpg";
import {
  categories,
  combos,
  offers,
  products,
} from "@/lib/menu-data";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Go Burger — Fire-seared smash burgers, delivered hot" },
      {
        name: "description",
        content:
          "Order craft smash burgers, hand-cut fries, and cocoa shakes from Go Burger. Free delivery over 25 ﷼.",
      },
      {
        property: "og:title",
        content: "Go Burger — Fire-seared smash burgers, delivered hot",
      },
      {
        property: "og:description",
        content:
          "Order craft smash burgers, hand-cut fries, and cocoa shakes from Go Burger. Free delivery over 25 ﷼.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const signatures = products.filter((p) => p.category === "signatures");
  const popular = products.slice(0, 4);

  return (
    <>
      <Hero />
      <CategoryRail />
      <Offers />
      <PopularSection items={popular} />
      <CombosSection />
      <SignaturesSection items={signatures} />
      <PromoBand />
      <ValueProps />
    </>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const { t, lang } = useT();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="absolute -right-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-flame/25 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-8 sm:px-6 lg:grid-cols-2 lg:pt-16 lg:pb-12">
        <div className="flex flex-col justify-center">
          <h1 className="font-hero text-6xl leading-[0.9] text-foreground sm:text-7xl lg:text-[7.5rem]">
            <span className="block mb-4">{t("heroTitle1")}</span>
            <span className="text-primary whitespace-nowrap">{t("heroTitle2")}</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            {t("heroDesc")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="ember-glow inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              {t("heroOrderNow")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-border/60 pt-6">
            {[
              ["12", t("heroMinPrep")],
              ["25", t("heroMinDoor")],
              ["4.9★", t("heroRating")],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl text-primary">{v}</dt>
                <dd className="text-xs uppercase tracking-widest text-muted-foreground">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-gradient-radial from-primary/40 via-primary/10 to-transparent blur-2xl" />
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border/60 bg-card grain">
            <img
              src={heroBurger}
              alt="The Ember Double, Go Burger's signature double smash burger"
              className="h-full w-full object-cover"
              width={800}
              height={800}
            />
          </div>
          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-2xl backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("heroSignature")}
              </p>
              <p className="font-display text-lg text-foreground">
                {lang === "ar" ? "إمبور مزدوج" : "Ember Double"} · {price(12.5)}
              </p>
            </div>
          </div>
          <div className="absolute -right-2 top-8 rotate-6 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              12,480 {t("heroReviews")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Categories ---------- */

function CategoryRail() {
  const { t, lang } = useT();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        eyebrow={t("catShortcut")}
        title={t("catTitle")}
        action={{ label: t("footerMenu"), to: "/menu" }}
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/menu"
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 bg-card"
          >
            <img
              src={c.image}
              alt={lang === "ar" ? c.nameAr : c.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="font-display text-lg text-foreground">{lang === "ar" ? c.nameAr : c.name}</p>
              <p className="text-xs uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
                {t("catBrowse")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Offers ---------- */

function Offers() {
  const { t, lang } = useT();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        {offers.map((o, i) => (
          <div
            key={o.id}
            className={`relative overflow-hidden rounded-3xl border p-6 ${
              i === 0
                ? "border-primary/40 bg-gradient-to-br from-primary/25 via-primary/5 to-transparent"
                : i === 1
                  ? "border-flame/40 bg-gradient-to-br from-flame/25 via-flame/5 to-transparent"
                  : "border-border/60 bg-card"
            }`}
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {t("offerLabel")}
              </p>
              <h3 className="mt-2 font-display text-2xl text-foreground">
                {lang === "ar" ? o.titleAr : o.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {lang === "ar" ? o.subtitleAr : o.subtitle}
              </p>
              <Link
                to="/offers"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Popular ---------- */

function PopularSection({ items }: { items: typeof products }) {
  const { t } = useT();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        eyebrow={t("popularEyebrow")}
        title={t("popularTitle")}
        action={{ label: t("popularSeeAll"), to: "/menu" }}
      />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const { lang } = useT();

  return (
    <Link
      to="/menu"
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:ember-glow"
    >
      <div className="relative aspect-square overflow-hidden bg-ash">
        <img
          src={product.image}
          alt={lang === "ar" ? product.nameAr : product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            {lang === "ar" ? (product.badgeAr ?? product.badge) : product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base text-foreground">
          {lang === "ar" ? product.nameAr : product.name}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {lang === "ar" ? product.taglineAr : product.tagline}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-display text-lg text-primary">
            {price(product.price)}
          </p>
          {product.calories && (
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {product.calories} cal
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ---------- Combos ---------- */

function CombosSection() {
  const { t, lang } = useT();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        eyebrow={t("comboEyebrow")}
        title={t("comboTitle")}
        action={{ label: t("footerCombos"), to: "/menu" }}
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {combos.map((c) => (
          <Link
            key={c.id}
            to="/menu"
            className="group relative flex overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card to-secondary"
          >
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">
                  Combo · {t("comboSave")} {price(c.save)}
                </p>
                <h3 className="mt-3 font-display text-3xl text-foreground">
                  {lang === "ar" ? c.nameAr : c.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{lang === "ar" ? c.itemsAr : c.items}</p>
              </div>
              <div className="mt-6">
                <p className="font-display text-3xl text-primary">
                  {price(c.price)}
                </p>
              </div>
            </div>
            <div className="relative w-40 shrink-0 overflow-hidden sm:w-56">
              <img
                src={c.image}
                alt={lang === "ar" ? c.nameAr : c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/40" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Signatures ---------- */

function SignaturesSection({ items }: { items: typeof products }) {
  const { t } = useT();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        eyebrow={t("sigEyebrow")}
        title={t("sigTitle")}
        action={{ label: t("sigViewAll"), to: "/menu" }}
      />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Promo band ---------- */

function PromoBand() {
  const { t } = useT();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-r from-flame via-primary to-flame p-10 sm:p-16">
        <div className="absolute inset-0 grain opacity-60" />
        <div className="relative grid gap-6 sm:grid-cols-[1.5fr_1fr] sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/80">
              {t("promoEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-4xl text-primary-foreground sm:text-6xl">
              {t("promoTitle")}
            </h2>
            <p className="mt-3 max-w-md text-sm text-primary-foreground/85 sm:text-base">
              {t("promoDesc")}
            </p>
          </div>
          <Link
            to="/account"
            className="justify-self-start rounded-full bg-charcoal px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:scale-105 sm:justify-self-end"
          >
            {t("promoJoin")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Value props ---------- */

function ValueProps() {
  const { t } = useT();

  const items = [
    {
      icon: Flame,
      title: t("vpFire"),
      body: t("vpFireBody"),
    },
    {
      icon: Clock,
      title: t("vp12"),
      body: t("vp12Body"),
    },
    {
      icon: Truck,
      title: t("vpFree"),
      body: t("vpFreeBody"),
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((v) => (
          <div
            key={v.title}
            className="rounded-3xl border border-border/60 bg-card p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <v.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-xl text-foreground">
              {v.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Section header ---------- */

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          to={action.to as "/menu" | "/offers" | "/account"}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
