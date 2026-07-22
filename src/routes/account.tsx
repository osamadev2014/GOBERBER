import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  MapPin,
  Package,
  Sparkles,
  User,
  ChevronRight,
  Check,
} from "lucide-react";
import { products } from "@/lib/menu-data";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account — Go Burger" },
      {
        name: "description",
        content:
          "Manage orders, favorites, addresses, profile, and rewards.",
      },
      { property: "og:title", content: "Your account — Go Burger" },
      {
        property: "og:description",
        content:
          "Manage orders, favorites, addresses, profile, and rewards.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { t, lang } = useT();
  const [tab, setTab] = useState<"orders" | "favorites" | "addresses" | "profile" | "rewards">("orders");

  const TABS = [
    { id: "orders" as const, label: t("accountOrders"), Icon: Package },
    { id: "favorites" as const, label: t("accountFavorites"), Icon: Heart },
    { id: "addresses" as const, label: t("accountAddresses"), Icon: MapPin },
    { id: "profile" as const, label: t("accountProfile"), Icon: User },
    { id: "rewards" as const, label: t("accountRewards"), Icon: Sparkles },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-display text-primary-foreground">
            AJ
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              {t("accountWelcome")}
            </p>
            <h1 className="font-display text-4xl text-foreground">Alex Jordan</h1>
          </div>
        </div>
        <div className="rounded-3xl border border-primary/40 bg-primary/10 px-5 py-3 text-right">
          <p className="text-xs uppercase tracking-widest text-primary">
            {t("accountPoints")}
          </p>
          <p className="font-display text-3xl text-primary">1,248</p>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="flex overflow-x-auto lg:flex-col">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                tab === id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>

        <div>{tab === "orders" && <OrdersTab />}
          {tab === "favorites" && <FavoritesTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "profile" && <ProfileTab />}
          {tab === "rewards" && <RewardsTab />}
        </div>
      </div>
    </div>
  );
}

const orders = [
  {
    id: "GB-2841",
    date: "Yesterday · 7:42 PM",
    total: 32.4,
    status: "Delivered",
    items: "Ember Double · Fries · Cocoa Shake",
    productIds: ["p1", "p7", "p8"],
  },
  {
    id: "GB-2799",
    date: "Feb 18 · 1:20 PM",
    total: 18.9,
    status: "Delivered",
    items: "البرج المشوي · فرايز",
    productIds: ["p3", "p7"],
  },
  {
    id: "GB-2712",
    date: "Feb 04 · 8:11 PM",
    total: 49.9,
    status: "Delivered",
    items: "Family Feast combo",
    productIds: ["p1", "p3", "p7", "p8"],
  },
];

function OrdersTab() {
  const { add } = useCart();
  const { t } = useT();
  const [reordered, setReordered] = useState<string | null>(null);

  const handleReorder = (order: typeof orders[number]) => {
    order.productIds.forEach((pid) => {
      const p = products.find((x) => x.id === pid);
      if (p) add(p);
    });
    setReordered(order.id);
    setTimeout(() => setReordered(null), 1500);
  };

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <article
          key={o.id}
          className="flex items-center justify-between rounded-3xl border border-border/60 bg-card p-5"
        >
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display text-lg">{o.id}</h3>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                {o.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{o.items}</p>
            <p className="text-xs text-muted-foreground">{o.date}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl text-primary">
              {price(o.total)}
            </p>
            <button
              onClick={() => handleReorder(o)}
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              {reordered === o.id ? (
                <><Check className="h-3 w-3" /> {t("accountAdded")}</>
              ) : (
                <><span>{t("accountReorder")}</span> <ChevronRight className="h-3 w-3" /></>
              )}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function FavoritesTab() {
  const { add } = useCart();
  const { t, lang } = useT();
  const favs = products.slice(0, 4);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {favs.map((p) => (
        <Link
          key={p.id}
          to="/menu/$slug"
          params={{ slug: p.slug }}
          className="overflow-hidden rounded-3xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:border-primary/50"
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={p.image}
              alt={lang === "ar" ? p.nameAr : p.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-display">{lang === "ar" ? p.nameAr : p.name}</h3>
              <p className="text-sm text-primary">{price(p.price)}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                add(p);
              }}
              className="text-primary"
            >
              <Heart className="h-4 w-4 fill-current" />
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

function AddressesTab() {
  const { t } = useT();
  const [list, setList] = useState([
    { label: "Home", addr: "128 Ember Lane, Apt 4B · Downtown", pri: true },
    { label: "Work", addr: "500 Grill Ave, Floor 12 · Midtown", pri: false },
    { label: "Gym", addr: "22 Sear Street · Riverside", pri: false },
  ]);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddr, setNewAddr] = useState("");

  return (
    <div className="space-y-3">
      {list.map((a) => (
        <article
          key={a.label}
          className="flex items-start justify-between gap-3 rounded-3xl border border-border/60 bg-card p-5"
        >
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="flex items-center gap-2 font-semibold">
                {a.label}
                {a.pri && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                    {t("accountDefault")}
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">{a.addr}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setList((prev) =>
                prev.map((x) => ({ ...x, pri: x.label === a.label })),
              );
            }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {a.pri ? t("accountDefault") : t("accountSetDefault")}
          </button>
        </article>
      ))}
      {adding ? (
        <div className="rounded-3xl border border-primary bg-primary/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">{t("accountAddAddress")}</p>
            <button onClick={() => { setAdding(false); setNewLabel(""); setNewAddr(""); }} className="text-muted-foreground hover:text-foreground text-xs">
              {t("checkoutCancel")}
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
              setList((prev) => [...prev, { label: newLabel.trim(), addr: newAddr.trim(), pri: false }]);
              setAdding(false);
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
          onClick={() => setAdding(true)}
          className="w-full rounded-3xl border border-dashed border-border/60 py-6 text-sm text-muted-foreground hover:border-primary hover:text-primary"
        >
          {t("accountAddAddress")}
        </button>
      )}
    </div>
  );
}

function ProfileTab() {
  const { t } = useT();
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="space-y-4 rounded-3xl border border-border/60 bg-card p-6"
    >
      {[
        { label: "Full name", value: "Alex Jordan" },
        { label: "Email", value: "alex@example.com" },
        { label: "Phone", value: "+1 (555) 128-4200" },
      ].map((f) => (
        <label key={f.label} className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {f.label}
          </span>
          <input
            defaultValue={f.value}
            className="mt-1 w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
        </label>
      ))}
      <button
        type="submit"
        className="ember-glow inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground"
      >
        {saved ? <><Check className="h-4 w-4" /> {t("accountSaved")}</> : t("accountSaveChanges")}
      </button>
    </form>
  );
}

function RewardsTab() {
  const { t } = useT();

  return (
    <div className="rounded-[2rem] border border-primary/40 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">
        {t("accountRewardsTitle")}
      </p>
      <h2 className="mt-3 font-display text-4xl">1,248 {t("accountPoints")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("accountRewardsDesc")}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
        <div className="h-full w-4/5 bg-primary" />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { name: "Free fries", cost: 500 },
          { name: "Free shake", cost: 800 },
          { name: "Free signature burger", cost: 1500 },
        ].map((r) => (
          <div
            key={r.name}
            className="rounded-2xl border border-border/60 bg-card p-4"
          >
            <p className="font-display text-lg">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.cost} pts</p>
            <button
              disabled={1248 < r.cost}
              className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
            >
              {1248 >= r.cost ? t("accountRedeem") : t("accountPtsNeeded", { n: r.cost - 1248 })}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
