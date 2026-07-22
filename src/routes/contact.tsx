import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Clock,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Check,
} from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Go Burger" },
      {
        name: "description",
        content:
          "Find Go Burger locations, opening hours, and get in touch with our team.",
      },
      { property: "og:title", content: "Contact — Go Burger" },
      {
        property: "og:description",
        content:
          "Find Go Burger locations, opening hours, and get in touch with our team.",
      },
    ],
  }),
  component: ContactPage,
});

const BRANCHES = [
  {
    id: "downtown",
    name: "Downtown Flagship",
    addr: "128 Ember Lane, Downtown",
    phone: "+1 (555) 128-4200",
    hours: "11:00 – 01:00 daily",
    lat: 40.712,
    lng: -74.006,
  },
  {
    id: "riverside",
    name: "Riverside",
    addr: "22 Sear Street, Riverside",
    phone: "+1 (555) 128-4211",
    hours: "11:30 – 23:00 daily",
    lat: 40.735,
    lng: -74.02,
  },
  {
    id: "midtown",
    name: "Midtown",
    addr: "500 Grill Ave, Midtown",
    phone: "+1 (555) 128-4222",
    hours: "10:00 – 00:00 daily",
    lat: 40.754,
    lng: -73.99,
  },
];

function ContactPage() {
  const { t } = useT();
  const [active, setActive] = useState(BRANCHES[0].id);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const branch = BRANCHES.find((b) => b.id === active)!;

  const bbox = `${branch.lng - 0.01},${branch.lat - 0.005},${branch.lng + 0.01},${branch.lat + 0.005}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${branch.lat},${branch.lng}`;

  const canSubmit = name.trim() && email.trim() && message.trim();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          {t("contactEyebrow")}
        </p>
        <h1 className="mt-3 font-display text-6xl text-foreground sm:text-7xl">
          {t("contactTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {t("contactDesc")}
        </p>
      </header>

      {/* Map + branches */}
      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card">
          <iframe
            title={`Map — ${branch.name}`}
            src={mapSrc}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="space-y-3">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => setActive(b.id)}
              className={`w-full rounded-3xl border p-5 text-left transition-all ${
                active === b.id
                  ? "border-primary bg-primary/10 ember-glow"
                  : "border-border/60 bg-card hover:border-border"
              }`}
            >
              <p className="flex items-center gap-2 font-display text-lg">
                <MapPin className="h-4 w-4 text-primary" />
                {b.name}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{b.addr}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  {b.hours}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-primary" />
                  {b.phone}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contact form + info */}
      <div className="mt-16 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            setSent(true);
          }}
          className="rounded-[2rem] border border-border/60 bg-card p-8"
        >
          <h2 className="font-display text-3xl">{t("contactFormTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("contactFormDesc")}
          </p>

          {sent ? (
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-primary/10 p-5 text-primary">
              <Check className="h-5 w-5" />
              <div>
                <p className="font-semibold">{t("contactSent")}</p>
                <p className="text-sm text-primary/80">
                  {t("contactSentDesc", { name })}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("contactName")}
                  placeholder={t("contactNamePlaceholder")}
                  value={name}
                  onChange={setName}
                />
                <Field
                  label={t("contactEmail")}
                  type="email"
                  placeholder={t("contactEmailPlaceholder")}
                  value={email}
                  onChange={setEmail}
                />
              </div>
              <Field
                label={t("contactSubject")}
                placeholder={t("contactSubjectPlaceholder")}
                value={subject}
                onChange={setSubject}
              />
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("contactMessage")}
                </span>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border/60 bg-background p-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder={t("contactMessagePlaceholder")}
                />
              </label>
              <button
                type="submit"
                disabled={!canSubmit}
                className="ember-glow rounded-full bg-primary px-8 py-3.5 font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {t("contactSend")}
              </button>
            </div>
          )}
        </form>

        <aside className="space-y-4">
          <InfoRow
            Icon={Mail}
            title={t("contactEmailInfo")}
            body="hello@goburger.co"
          />
          <InfoRow
            Icon={Phone}
            title={t("contactPhoneInfo")}
            body="+1 (555) 128-4200"
          />
          <InfoRow
            Icon={Clock}
            title={t("contactHoursInfo")}
            body={t("contactHours")}
          />
          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              {t("contactFollow")}
            </p>
            <div className="mt-3 flex gap-2">
              {[Instagram, Facebook, Twitter].map((I, i) => (
                <span
                  key={i}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:border-primary hover:text-primary cursor-default"
                >
                  <I className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function InfoRow({
  Icon,
  title,
  body,
}: {
  Icon: typeof Mail;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-card p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 font-semibold text-foreground">{body}</p>
      </div>
    </div>
  );
}
